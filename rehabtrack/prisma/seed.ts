import { PrismaClient, ActivityType, BadgeRarity } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const badges = [
  { name: "First Step", description: "Complete your first activity", icon: "🦶", xpRequired: 0, rarity: BadgeRarity.COMMON },
  { name: "Week Warrior", description: "Stay active for 7 days in a row", icon: "⚔️", xpRequired: 500, rarity: BadgeRarity.RARE },
  { name: "XP Hunter", description: "Earn 1000 XP total", icon: "⭐", xpRequired: 1000, rarity: BadgeRarity.RARE },
  { name: "Stretch Master", description: "Complete 20 stretching sessions", icon: "🧘", xpRequired: 200, rarity: BadgeRarity.COMMON },
  { name: "Walk Champion", description: "Walk for more than 30 minutes", icon: "🚶", xpRequired: 300, rarity: BadgeRarity.COMMON },
  { name: "Iron Will", description: "Earn 5000 XP total", icon: "💪", xpRequired: 5000, rarity: BadgeRarity.EPIC },
  { name: "Legend", description: "Reach level 10", icon: "👑", xpRequired: 10000, rarity: BadgeRarity.LEGENDARY },
  { name: "Comeback Kid", description: "Return after a 3-day break", icon: "🔥", xpRequired: 100, rarity: BadgeRarity.COMMON },
];

const sampleUsers = [
  { name: "Alex Chen", email: "alex@demo.com", totalXp: 4850, level: 7, streak: 12 },
  { name: "Maria Santos", email: "maria@demo.com", totalXp: 3200, level: 5, streak: 8 },
  { name: "James Wilson", email: "james@demo.com", totalXp: 2800, level: 5, streak: 5 },
  { name: "Priya Patel", email: "priya@demo.com", totalXp: 2100, level: 4, streak: 14 },
  { name: "Tom Baker", email: "tom@demo.com", totalXp: 1500, level: 3, streak: 3 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Seed badges
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
  console.log("✅ Badges seeded");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@rehabtrack.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@rehabtrack.com",
      password: hashedPassword,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    },
  });

  // Create score for demo user
  await prisma.score.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      totalXp: 750,
      level: 2,
      streak: 3,
    },
  });

  // Seed sample users for leaderboard
  for (const userData of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      },
    });

    await prisma.score.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        totalXp: userData.totalXp,
        level: userData.level,
        streak: userData.streak,
      },
    });

    // Add some activities
    const activityTypes: ActivityType[] = [ActivityType.WALKING, ActivityType.STRETCHING, ActivityType.STRENGTH];
    for (let i = 0; i < 5; i++) {
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: activityTypes[i % 3],
          duration: 300 + Math.floor(Math.random() * 1200),
          xpEarned: 50 + Math.floor(Math.random() * 100),
          intensity: 0.3 + Math.random() * 0.7,
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
  console.log("✅ Sample users seeded");

  // Give demo user some activities
  const activityData = [
    { type: ActivityType.WALKING, duration: 600, xpEarned: 80, intensity: 0.7 },
    { type: ActivityType.STRETCHING, duration: 300, xpEarned: 40, intensity: 0.4 },
    { type: ActivityType.STRENGTH, duration: 900, xpEarned: 120, intensity: 0.8 },
    { type: ActivityType.BALANCE, duration: 450, xpEarned: 60, intensity: 0.5 },
    { type: ActivityType.WALKING, duration: 480, xpEarned: 65, intensity: 0.6 },
  ];

  for (let i = 0; i < activityData.length; i++) {
    await prisma.activity.create({
      data: {
        userId: demoUser.id,
        ...activityData[i],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Give demo user some badges
  const badgeList = await prisma.badge.findMany({ take: 3 });
  for (const badge of badgeList) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demoUser.id, badgeId: badge.id } },
      update: {},
      create: { userId: demoUser.id, badgeId: badge.id },
    });
  }

  console.log("✅ Demo user seeded");
  console.log("\n🎉 Seed complete!");
  console.log("Demo credentials: demo@rehabtrack.com / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
