"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Flame, Zap, Activity, Shield, Calendar } from "lucide-react";
import {
  getProgressToNextLevel,
  getRarityColor,
  getActivityIcon,
  formatDuration,
  getTimeAgo,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ActivityType } from "@/types";

interface BadgeRecord {
  badge: {
    id: string;
    icon: string;
    name: string;
    description: string;
    rarity: string;
  };
  earnedAt: string;
}

interface ActivityRecord {
  id: string;
  type: ActivityType;
  duration: number;
  xpEarned: number;
  intensity: number;
  createdAt: string;
}

export function ProfileContent() {
  const { data: session } = useSession();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => fetch("/api/user").then((r) => r.json()),
    enabled: !!session,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const score = user?.score;
  const { level, progressPercent, nextLevelXp, currentLevelXp } = score
    ? getProgressToNextLevel(score.totalXp)
    : { level: 1, progressPercent: 0, nextLevelXp: 100, currentLevelXp: 0 };

  const badges: BadgeRecord[] = user?.badges ?? [];
  const activities: ActivityRecord[] = user?.activities ?? [];

  const avatarUrl =
    session?.user?.image ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      session?.user?.name ?? "user"
    )}`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-white/35 text-sm mt-1">
          Your recovery journey &amp; achievements
        </p>
      </div>

      {/* Profile hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-white/5 flex flex-col sm:flex-row gap-6 items-start"
      >
        <div className="relative flex-shrink-0">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-24 h-24 rounded-2xl border-2 border-white/10 bg-white/5"
          />
          <div className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-lg">
            <span className="font-display font-bold text-sm text-emerald-400">
              {level}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl font-bold">
            {session?.user?.name}
          </h2>
          <p className="text-white/35 text-sm mt-0.5">{session?.user?.email}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <Calendar className="w-3.5 h-3.5" />
              {user?.createdAt
                ? `Joined ${format(new Date(user.createdAt), "MMMM yyyy")}`
                : "—"}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              {(score?.totalXp ?? 0).toLocaleString()} XP total
            </span>
            <span className="flex items-center gap-1.5 text-xs text-orange-400">
              <Flame className="w-3.5 h-3.5" />
              {score?.streak ?? 0} day streak
            </span>
          </div>

          {/* Level bar */}
          <div className="mt-5">
            <div className="flex justify-between text-[11px] text-white/25 mb-1.5">
              <span>Level {level}</span>
              <span>
                {Math.round(progressPercent)}% → Level {level + 1}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1.5">
              {(score?.totalXp ?? 0) - currentLevelXp} /{" "}
              {nextLevelXp - currentLevelXp} XP to next level
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Activity,
            label: "Total Activities",
            value: activities.length.toString(),
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
          },
          {
            icon: Flame,
            label: "Day Streak",
            value: `${score?.streak ?? 0}d`,
            color: "text-orange-400",
            bg: "bg-orange-400/10",
          },
          {
            icon: Zap,
            label: "Total XP",
            value: (score?.totalXp ?? 0).toLocaleString(),
            color: "text-amber-400",
            bg: "bg-amber-400/10",
          },
          {
            icon: Shield,
            label: "Badges Earned",
            value: badges.length.toString(),
            color: "text-violet-400",
            bg: "bg-violet-400/10",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className={`font-display text-2xl font-bold ${s.color}`}>
              {s.value}
            </div>
            <div className="text-[11px] text-white/25 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <h3 className="text-xs text-white/35 font-medium mb-5 flex items-center gap-1.5 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Achievements ({badges.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badges.map(({ badge, earnedAt }, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
                className={`rounded-xl p-4 border text-center cursor-default ${getRarityColor(badge.rarity)}`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="text-xs font-semibold leading-tight mb-1">
                  {badge.name}
                </div>
                <div className="text-[10px] text-white/25 leading-snug">
                  {badge.description}
                </div>
                <div className="text-[10px] text-white/15 mt-2">
                  {getTimeAgo(new Date(earnedAt))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Activity history */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <h3 className="text-xs text-white/35 font-medium mb-5 uppercase tracking-wider">
          Activity History
        </h3>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/25 text-sm">No activities recorded yet.</p>
            <p className="text-white/15 text-xs mt-1">
              Start tracking to build your history!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 12).map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <span className="text-xl w-8 text-center flex-shrink-0">
                  {getActivityIcon(a.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium capitalize">
                    {a.type.toLowerCase()}
                  </div>
                  <div className="text-xs text-white/25">
                    {formatDuration(a.duration)} ·{" "}
                    {Math.round(a.intensity * 100)}% intensity
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-amber-400">
                    +{a.xpEarned} XP
                  </div>
                  <div className="text-[11px] text-white/25">
                    {getTimeAgo(new Date(a.createdAt))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
