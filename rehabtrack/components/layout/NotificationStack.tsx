"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store";
import { X, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export function NotificationStack() {
  const { notifications, removeNotification } = useUIStore();

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    info: <Info className="w-4 h-4 text-cyan-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  };

  const borders = {
    success: "border-emerald-500/20 bg-emerald-500/5",
    info: "border-cyan-500/20 bg-cyan-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className={`pointer-events-auto flex items-center gap-3 glass rounded-xl px-4 py-3 border max-w-sm shadow-2xl ${borders[n.type]}`}
          >
            {icons[n.type]}
            <p className="text-sm text-white/80 flex-1">{n.message}</p>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
