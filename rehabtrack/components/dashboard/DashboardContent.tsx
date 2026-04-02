"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { StatsCard } from "./StatsCard";
import { ProgressRing } from "./ProgressRing";
import { ActivityFeed } from "./ActivityFeed";
import { XPBar } from "./XPBar";
import { Flame, Activity, Zap, TrendingUp, Trophy, Target } from "lucide-react";
import { getProgressToNextLevel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function DashboardContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => fetch("/api/activity?limit=6").then((r) => r.json()),
    refetchInterval: 15_000,
  });

  const score = data?.score;
  const { level, progressPercent, nextLevelXp, currentLevelXp } = score
    ? getProgressToNextLevel(score.totalXp)
    : { level: 1, progressPercent: 0, nextLevelXp: 100, currentLevelXp: 0 };

  const DAILY_GOAL_XP = 300;
  const todayXp = data?.todayXp ?? 0;
  const dailyProgress = Math.min(100, (todayXp / DAILY_GOAL_XP) * 100);
  const weeklyXp = data?.weeklyXp ?? 0;

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-white/30">
        <p>Failed to load dashboard data. Please refresh.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-6xl"
    >
      {/* Page title */}
      <motion.div variants={itemVariants}>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-white/35 text-sm mt-1">
          Your rehabilitation progress at a glance
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Zap}
          label="Total XP"
          value={(score?.totalXp ?? 0).toLocaleString()}
          color="text-amber-400"
          bgColor="bg-amber-400/10"
          borderColor="border-amber-400/20"
          trend={`+${weeklyXp} this week`}
        />
        <StatsCard
          icon={Flame}
          label="Day Streak"
          value={`${score?.streak ?? 0}`}
          suffix="days"
          color="text-orange-400"
          bgColor="bg-orange-400/10"
          borderColor="border-orange-400/20"
          trend={score?.streak > 0 ? "🔥 Keep going!" : "Start today!"}
        />
        <StatsCard
          icon={Activity}
          label="Activities"
          value={`${data?.totalActivities ?? 0}`}
          color="text-cyan-400"
          bgColor="bg-cyan-400/10"
          borderColor="border-cyan-400/20"
          trend={`${data?.activities?.length ?? 0} recent logged`}
        />
        <StatsCard
          icon={Trophy}
          label="Level"
          value={`${level}`}
          color="text-emerald-400"
          bgColor="bg-emerald-400/10"
          borderColor="border-emerald-400/20"
          trend={`${Math.round(progressPercent)}% to Level ${level + 1}`}
        />
      </motion.div>

      {/* Middle row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily goal ring */}
        <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-xs text-white/35 font-medium flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Daily Goal
            </h3>
            <span className="text-xs text-white/25">{DAILY_GOAL_XP} XP target</span>
          </div>
          <ProgressRing
            progress={dailyProgress}
            size={148}
            label={`${Math.round(dailyProgress)}%`}
            sublabel={`${todayXp} / ${DAILY_GOAL_XP} XP`}
          />
          <p className="text-xs text-white/25 text-center">
            {dailyProgress >= 100
              ? "🎉 Daily goal smashed!"
              : `${DAILY_GOAL_XP - todayXp} XP remaining today`}
          </p>
        </div>

        {/* XP & level card */}
        <div className="glass rounded-2xl p-6 border border-white/5 col-span-1 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xs text-white/35 font-medium mb-3">Level Progress</h3>
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-display text-5xl font-bold text-gradient">
                Lv.{level}
              </span>
              <span className="text-white/25 text-sm">
                {(score?.totalXp ?? 0).toLocaleString()} total XP
              </span>
            </div>
            <XPBar
              progress={progressPercent}
              currentXp={score?.totalXp ?? 0}
              currentLevelXp={currentLevelXp}
              nextLevelXp={nextLevelXp}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Today", value: todayXp, color: "text-emerald-400" },
              { label: "This Week", value: weeklyXp, color: "text-cyan-400" },
              { label: "Streak", value: `${score?.streak ?? 0}d`, color: "text-orange-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/3 rounded-xl p-4 border border-white/5">
                <div className="text-[11px] text-white/25 mb-1">{s.label}</div>
                <div className={`font-display text-xl font-bold ${s.color}`}>
                  {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                  {typeof s.value === "number" && " XP"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent activities */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs text-white/35 font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Recent Activities
          </h3>
          <a href="/activity" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            Track new →
          </a>
        </div>
        <ActivityFeed activities={data?.activities ?? []} />
      </motion.div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl">
      <Skeleton className="h-8 w-52" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl col-span-2" />
      </div>
      <Skeleton className="h-52 rounded-2xl" />
    </div>
  );
}
