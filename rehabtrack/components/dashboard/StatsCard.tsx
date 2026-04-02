"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  bgColor,
  borderColor,
  trend,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        "glass rounded-2xl p-5 border flex flex-col gap-3 cursor-default",
        borderColor
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/35 font-medium uppercase tracking-wider">
          {label}
        </span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bgColor)}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className={cn("font-display text-2xl font-bold", color)}>{value}</span>
        {suffix && <span className="text-white/30 text-sm">{suffix}</span>}
      </div>

      {trend && (
        <p className="text-[11px] text-white/25 leading-tight">{trend}</p>
      )}
    </motion.div>
  );
}
