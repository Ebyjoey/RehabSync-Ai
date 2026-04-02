"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProgressToNextLevel } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();

  const { data: activityData } = useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => fetch("/api/activity").then((r) => r.json()),
    enabled: !!session,
    refetchInterval: 30_000,
  });

  const score = activityData?.score;
  const { progressPercent, level } = score
    ? getProgressToNextLevel(score.totalXp)
    : { progressPercent: 0, level: 1 };

  const avatarUrl =
    session?.user?.image ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session?.user?.name ?? "user")}`;

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0 border-b border-white/5"
      style={{
        background: "rgba(7, 10, 18, 0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Left — level progress */}
      <div className="flex items-center gap-4">
        {score && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg border border-white/5">
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Lv</span>
              <span className="font-display font-bold text-emerald-400 text-sm">{level}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                />
              </div>
              <span className="text-xs text-white/25 tabular-nums">
                {score.totalXp.toLocaleString()} XP
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right — user menu */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl text-white/25 hover:text-white/60 hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 glass px-3 py-1.5 rounded-xl border border-white/5">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-6 h-6 rounded-full bg-white/10"
          />
          <span className="text-sm text-white/60 hidden sm:block max-w-[120px] truncate">
            {session?.user?.name}
          </span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-2 rounded-xl text-white/25 hover:text-red-400 hover:bg-red-500/8 transition-all"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
