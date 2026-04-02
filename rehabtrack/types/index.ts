export type ActivityType = "WALKING" | "STRETCHING" | "STRENGTH" | "BALANCE" | "IDLE";
export type BadgeRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  duration: number;
  xpEarned: number;
  intensity: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Score {
  id: string;
  userId: string;
  totalXp: number;
  level: number;
  streak: number;
  lastActive: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpRequired: number;
  rarity: BadgeRarity;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  totalXp: number;
  level: number;
  streak: number;
}

export interface ActivitySession {
  type: ActivityType;
  startTime: number;
  duration: number;
  intensity: number;
  xpEarned: number;
  isActive: boolean;
}

export interface DashboardStats {
  todayXp: number;
  weeklyXp: number;
  totalActivities: number;
  streak: number;
  level: number;
  totalXp: number;
  progressToNextLevel: number;
  xpForNextLevel: number;
  recentActivities: Activity[];
}

export interface AIFeedback {
  message: string;
  suggestion: string;
  intensity: "low" | "medium" | "high";
  emoji: string;
}
