import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scores = await prisma.score.findMany({
      orderBy: { totalXp: "desc" },
      take: 20,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    const leaderboard = scores.map((s, i) => ({
      rank: i + 1,
      userId: s.userId,
      name: s.user.name,
      image: s.user.image,
      totalXp: s.totalXp,
      level: s.level,
      streak: s.streak,
    }));

    return NextResponse.json(leaderboard);
  } catch (err) {
    console.error("[GET /api/leaderboard]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
