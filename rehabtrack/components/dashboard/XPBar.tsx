"use client";

import { motion } from "framer-motion";

interface Props {
  progress: number;
  currentXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
}

export function XPBar({ progress, currentXp, currentLevelXp, nextLevelXp }: Props) {
  const xpIntoLevel = currentXp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return (
    <div>
      <div className="flex justify-between text-[11px] text-white/25 mb-2">
        <span>{currentLevelXp.toLocaleString()} XP</span>
        <span>{nextLevelXp.toLocaleString()} XP</span>
      </div>

      <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 relative overflow-hidden"
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2.5s linear infinite",
            }}
          />
        </motion.div>
      </div>

      <p className="text-[11px] text-white/25 mt-2 text-center">
        {xpIntoLevel.toLocaleString()} /{" "}
        {xpNeeded.toLocaleString()} XP to next level
      </p>
    </div>
  );
}
