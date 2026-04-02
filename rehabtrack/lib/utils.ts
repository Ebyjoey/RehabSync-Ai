import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActivityType, AIFeedback } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getXpForLevel(level: number): number {
  return level * level * 100;
}

export function getLevelFromXp(xp: number): number {
  let level = 1;
  while (getXpForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

export function getProgressToNextLevel(xp: number): {
  level: number;
  progressPercent: number;
  currentLevelXp: number;
  nextLevelXp: number;
} {
  const level = getLevelFromXp(xp);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const progressPercent = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return {
    level,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    currentLevelXp,
    nextLevelXp,
  };
}

export function getActivityXp(type: ActivityType, duration: number, intensity: number): number {
  const baseXp: Record<ActivityType, number> = {
    WALKING: 1.0,
    STRETCHING: 0.8,
    STRENGTH: 1.5,
    BALANCE: 1.2,
    IDLE: 0.1,
  };

  const durationMinutes = duration / 60;
  const base = baseXp[type] || 1.0;
  const xp = Math.floor(base * durationMinutes * intensity * 10);

  return Math.max(1, Math.min(xp, 500)); // Cap at 500 XP per activity
}

export function getAIFeedback(type: ActivityType, intensity: number, duration: number): AIFeedback {
  const durationMin = Math.floor(duration / 60);

  const feedbackMap: Record<ActivityType, AIFeedback[]> = {
    WALKING: [
      {
        message: "Great walking session!",
        suggestion: "Try increasing your pace slightly next time.",
        intensity: "medium",
        emoji: "🚶",
      },
      {
        message: "Excellent mobility work!",
        suggestion: "Add some arm swings to engage your upper body.",
        intensity: "medium",
        emoji: "💪",
      },
    ],
    STRETCHING: [
      {
        message: "Beautiful flexibility work!",
        suggestion: "Hold each stretch for 30 seconds for better results.",
        intensity: "low",
        emoji: "🧘",
      },
      {
        message: "Your flexibility is improving!",
        suggestion: "Focus on deep breathing during each stretch.",
        intensity: "low",
        emoji: "✨",
      },
    ],
    STRENGTH: [
      {
        message: "Outstanding strength training!",
        suggestion: "Remember to rest 48 hours between muscle groups.",
        intensity: "high",
        emoji: "🏋️",
      },
      {
        message: "Power level rising!",
        suggestion: "Ensure proper form over increasing weight.",
        intensity: "high",
        emoji: "⚡",
      },
    ],
    BALANCE: [
      {
        message: "Your balance is getting better!",
        suggestion: "Try closing your eyes for an added challenge.",
        intensity: "medium",
        emoji: "⚖️",
      },
      {
        message: "Core stability improving!",
        suggestion: "Progress to unstable surfaces when ready.",
        intensity: "medium",
        emoji: "🎯",
      },
    ],
    IDLE: [
      {
        message: "Rest is part of recovery!",
        suggestion: "Try some gentle stretching when ready.",
        intensity: "low",
        emoji: "😴",
      },
    ],
  };

  const options = feedbackMap[type] || feedbackMap.IDLE;
  const feedback = options[Math.floor(Math.random() * options.length)];

  // Adjust based on duration
  if (durationMin > 20) {
    feedback.message = `Incredible ${durationMin}-minute session! ` + feedback.message;
  } else if (durationMin < 5) {
    feedback.suggestion = "Try to extend your session to at least 10 minutes.";
  }

  return feedback;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    COMMON: "text-gray-400 border-gray-400/30 bg-gray-400/10",
    RARE: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    EPIC: "text-violet-400 border-violet-400/30 bg-violet-400/10",
    LEGENDARY: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  };
  return colors[rarity] || colors.COMMON;
}

export function getActivityColor(type: ActivityType): string {
  const colors: Record<ActivityType, string> = {
    WALKING: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    STRETCHING: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    STRENGTH: "text-rose-400 bg-rose-400/10 border-rose-400/30",
    BALANCE: "text-violet-400 bg-violet-400/10 border-violet-400/30",
    IDLE: "text-gray-400 bg-gray-400/10 border-gray-400/30",
  };
  return colors[type] || colors.IDLE;
}

export function getActivityIcon(type: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    WALKING: "🚶",
    STRETCHING: "🧘",
    STRENGTH: "💪",
    BALANCE: "⚖️",
    IDLE: "😴",
  };
  return icons[type] || "❓";
}

export function simulateActivityType(seed: number): ActivityType {
  const types: ActivityType[] = ["WALKING", "STRETCHING", "STRENGTH", "BALANCE"];
  return types[seed % types.length];
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
