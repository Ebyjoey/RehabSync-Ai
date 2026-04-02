"use client";

import { motion } from "framer-motion";
import { Activity } from "@/types";
import {
  getActivityIcon,
  getActivityColor,
  formatDuration,
  getTimeAgo,
} from "@/lib/utils";

interface Props {
  activities: Activity[];
}

export function ActivityFeed({ activities }: Props) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">🏃</div>
        <p className="text-sm text-white/30">No activities logged yet.</p>
        <p className="text-xs text-white/20 mt-1">
          Head to Activity to start earning XP!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity, i) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
        >
          <span className="text-xl w-8 text-center flex-shrink-0">
            {getActivityIcon(activity.type)}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium capitalize">
                {activity.type.toLowerCase()}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${getActivityColor(
                  activity.type
                )}`}
              >
                {activity.type}
              </span>
            </div>
            <div className="text-xs text-white/25 mt-0.5">
              {formatDuration(activity.duration)} ·{" "}
              {Math.round(activity.intensity * 100)}% intensity
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-sm font-bold text-amber-400">
              +{activity.xpEarned} XP
            </div>
            <div className="text-[11px] text-white/25">
              {getTimeAgo(new Date(activity.createdAt))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
