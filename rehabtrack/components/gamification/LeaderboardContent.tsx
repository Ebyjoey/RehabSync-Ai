"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Trophy, Flame, Zap, Crown, Medal } from "lucide-react";
import { LeaderboardEntry } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const MEDAL_COLORS = ["text-amber-400", "text-slate-300", "text-amber-600"];
const MEDAL_BG = [
  "bg-amber-500/10 border-amber-500/25",
  "bg-slate-400/10 border-slate-400/25",
  "bg-amber-600/10 border-amber-600/25",
];
// Visual podium order: 2nd, 1st, 3rd
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_HEIGHTS = ["h-32", "h-44", "h-24"];

export function LeaderboardContent() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;

  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: () => fetch("/api/leaderboard").then((r) => r.json()),
    refetchInterval: 30_000,
  });

  const myEntry = leaderboard.find((e) => e.userId === userId);

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
        <p className="text-white/35 text-sm mt-1">
          Top rehab performers — live rankings
        </p>
      </div>

      {/* My rank banner */}
      {myEntry && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-white/35">Your current ranking</p>
            <p className="font-display font-bold text-emerald-400 text-lg">
              #{myEntry.rank}
              <span className="text-white/25 text-sm font-normal ml-1">
                of {leaderboard.length}
              </span>
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[11px] text-white/25">Level {myEntry.level}</p>
            <div className="flex items-center gap-1 text-amber-400 justify-end">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-bold">{myEntry.totalXp.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Podium — Top 3 */}
      {!isLoading && leaderboard.length >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-end justify-center gap-3 pt-4 pb-2"
        >
          {PODIUM_ORDER.map((rankIndex, col) => {
            const entry = leaderboard[rankIndex];
            if (!entry) return null;
            const isMe = entry.userId === userId;

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + col * 0.1, type: "spring", bounce: 0.3 }}
                className={`flex flex-col items-center ${col === 1 ? "z-10" : ""}`}
              >
                {/* Crown for #1 */}
                {col === 1 && (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    <Crown className="w-6 h-6 text-amber-400 mb-2" />
                  </motion.div>
                )}

                {/* Avatar */}
                <div className="relative">
                  <img
                    src={
                      entry.image ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`
                    }
                    alt={entry.name ?? ""}
                    className={`rounded-2xl border-2 border-white/15 mb-2 ${
                      col === 1 ? "w-16 h-16" : "w-12 h-12"
                    }`}
                  />
                  {isMe && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-[#070a12]" />
                  )}
                </div>

                {/* Name & XP */}
                <p className="text-xs font-medium text-center max-w-[80px] truncate">
                  {entry.name}
                </p>
                <p className={`text-xs font-bold mb-2 ${MEDAL_COLORS[rankIndex]}`}>
                  {entry.totalXp.toLocaleString()} XP
                </p>
                {isMe && (
                  <p className="text-[10px] text-emerald-400 mb-1">You</p>
                )}

                {/* Podium block */}
                <div
                  className={`w-24 ${PODIUM_HEIGHTS[col]} rounded-t-xl border ${MEDAL_BG[rankIndex]} flex flex-col items-center justify-start pt-3 gap-1`}
                >
                  <Medal className={`w-5 h-5 ${MEDAL_COLORS[rankIndex]}`} />
                  <span
                    className={`font-display font-bold text-xl ${MEDAL_COLORS[rankIndex]}`}
                  >
                    #{rankIndex + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Full rankings table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[32px_40px_1fr_64px_80px] gap-3 px-4 py-3 border-b border-white/5">
          <span className="text-[10px] text-white/20 uppercase tracking-wider text-center">#</span>
          <span className="text-[10px] text-white/20 uppercase tracking-wider" />
          <span className="text-[10px] text-white/20 uppercase tracking-wider">Player</span>
          <span className="text-[10px] text-white/20 uppercase tracking-wider text-right">Streak</span>
          <span className="text-[10px] text-white/20 uppercase tracking-wider text-right">XP</span>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-white/25">
            <Trophy className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No players yet. Be the first!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {leaderboard.map((entry, i) => {
              const isMe = entry.userId === userId;

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className={`grid grid-cols-[32px_40px_1fr_64px_80px] gap-3 items-center px-4 py-3.5 transition-colors hover:bg-white/[0.02] ${
                    isMe
                      ? "bg-emerald-500/[0.04] border-l-2 border-emerald-500"
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="text-center">
                    {entry.rank <= 3 ? (
                      <Medal
                        className={`w-4 h-4 mx-auto ${
                          MEDAL_COLORS[entry.rank - 1]
                        }`}
                      />
                    ) : (
                      <span className="text-xs text-white/25 font-mono">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <img
                    src={
                      entry.image ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`
                    }
                    alt=""
                    className="w-9 h-9 rounded-xl border border-white/10"
                  />

                  {/* Name & level */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">
                        {entry.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/25">
                      Level {entry.level}
                    </span>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-1 text-orange-400 justify-end">
                    <Flame className="w-3 h-3 flex-shrink-0" />
                    <span className="text-xs">{entry.streak}d</span>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-0.5 justify-end text-amber-400">
                    <Zap className="w-3 h-3 flex-shrink-0" />
                    <span className="text-sm font-bold tabular-nums">
                      {entry.totalXp.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-white/15">
        Rankings refresh every 30 seconds
      </p>
    </div>
  );
}
