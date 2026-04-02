import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActivityType } from "@/types";
import { getActivityXp, getLevelFromXp } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, duration, intensity } = body as {
      type: ActivityType;
      duration: number;
      intensity: number;
    };

    if (!type || !duration || duration < 1) {
      return NextResponse.json({ error: "Invalid activity data" }, { status: 400 });
    }

    const safeIntensity = Math.max(0.1, Math.min(1.0, intensity || 0.5));
    const xpEarned = getActivityXp(type, duration, safeIntensity);

    const [activity, currentScore] = await Promise.all([
      prisma.activity.create({
        data: {
          userId: session.user.id,
          type,
          duration,
          xpEarned,
          intensity: safeIntensity,
        },
      }),
      prisma.score.findUnique({ where: { userId: session.user.id } }),
    ]);

    const prevXp = currentScore?.totalXp ?? 0;
    const prevLevel = currentScore?.level ?? 1;
    const newXp = prevXp + xpEarned;
    const newLevel = getLevelFromXp(newXp);

    // Streak logic: if last active was 20-48h ago increment, >48h reset to 1
    const lastActive = currentScore?.lastActive ?? new Date(0);
    const hoursSince = (Date.now() - new Date(lastActive).getTime()) / 3_600_000;
    let newStreak = currentScore?.streak ?? 0;
    if (hoursSince >= 20 && hoursSince <= 48) {
      newStreak += 1;
    } else if (hoursSince > 48) {
      newStreak = 1;
    }
    // If <20h, streak stays the same (same day)

    const updatedScore = await prisma.score.upsert({
      where: { userId: session.user.id },
      update: {
        totalXp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActive: new Date(),
      },
      create: {
        userId: session.user.id,
        totalXp: newXp,
        level: newLevel,
        streak: 1,
        lastActive: new Date(),
      },
    });

    // Badge auto-award
    const allBadges = await prisma.badge.findMany();
    const existingUserBadges = await prisma.userBadge.findMany({
      where: { userId: session.user.id },
      select: { badgeId: true },
    });
    const earnedIds = new Set(existingUserBadges.map((b) => b.badgeId));

    const newBadges = [];
    for (const badge of allBadges) {
      if (!earnedIds.has(badge.id) && newXp >= badge.xpRequired) {
        await prisma.userBadge.create({
          data: { userId: session.user.id, badgeId: badge.id },
        });
        newBadges.push(badge);
      }
    }

    return NextResponse.json({
      activity,
      score: updatedScore,
      xpEarned,
      newBadges,
      leveledUp: newLevel > prevLevel,
      newLevel,
    });
  } catch (err) {
    console.error("[POST /api/activity]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10", 10));

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 3_600_000);

    const [activities, score, todayActivities, weeklyActivities, totalActivities] =
      await Promise.all([
        prisma.activity.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
        prisma.score.findUnique({ where: { userId: session.user.id } }),
        prisma.activity.findMany({
          where: { userId: session.user.id, createdAt: { gte: todayStart } },
        }),
        prisma.activity.findMany({
          where: { userId: session.user.id, createdAt: { gte: weekAgo } },
        }),
        prisma.activity.count({ where: { userId: session.user.id } }),
      ]);

    const todayXp = todayActivities.reduce((s, a) => s + a.xpEarned, 0);
    const weeklyXp = weeklyActivities.reduce((s, a) => s + a.xpEarned, 0);

    return NextResponse.json({ activities, score, todayXp, weeklyXp, totalActivities });
  } catch (err) {
    console.error("[GET /api/activity]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
