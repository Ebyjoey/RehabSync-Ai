"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActivityStore, useUIStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { ActivityType } from "@/types";
import { getActivityIcon, formatDuration } from "@/lib/utils";
import { Play, Square, Zap, Brain, CheckCircle2, Lightbulb } from "lucide-react";
import { AIFeedbackCard } from "./AIFeedbackCard";

const ACTIVITY_TYPES: {
  type: ActivityType;
  label: string;
  desc: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
}[] = [
  {
    type: "WALKING",
    label: "Walking",
    desc: "Cardio & mobility work",
    borderColor: "border-emerald-500/40 hover:border-emerald-500/80 bg-emerald-500/5",
    textColor: "text-emerald-400",
    glowColor: "hover:shadow-[0_0_24px_rgba(34,197,94,0.2)]",
  },
  {
    type: "STRETCHING",
    label: "Stretching",
    desc: "Flexibility & range of motion",
    borderColor: "border-cyan-500/40 hover:border-cyan-500/80 bg-cyan-500/5",
    textColor: "text-cyan-400",
    glowColor: "hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]",
  },
  {
    type: "STRENGTH",
    label: "Strength",
    desc: "Resistance & muscle training",
    borderColor: "border-rose-500/40 hover:border-rose-500/80 bg-rose-500/5",
    textColor: "text-rose-400",
    glowColor: "hover:shadow-[0_0_24px_rgba(244,63,94,0.2)]",
  },
  {
    type: "BALANCE",
    label: "Balance",
    desc: "Stability & coordination",
    borderColor: "border-violet-500/40 hover:border-violet-500/80 bg-violet-500/5",
    textColor: "text-violet-400",
    glowColor: "hover:shadow-[0_0_24px_rgba(167,139,250,0.2)]",
  },
];

const AI_MESSAGES: Record<ActivityType, string[]> = {
  WALKING: [
    "Natural gait pattern detected",
    "Stride length: within normal range",
    "Arm swing symmetry: 94%",
    "Cadence: 112 steps/min",
    "Postural alignment: upright",
  ],
  STRETCHING: [
    "Sustained stretch position held",
    "Breathing pattern: slow & steady",
    "Muscle tension: decreasing",
    "Range of motion: expanding",
    "Flexibility score improving",
  ],
  STRENGTH: [
    "High power output detected",
    "Muscle activation: 87% engagement",
    "Movement tempo: controlled",
    "Form consistency: excellent",
    "Progressive overload achieved",
  ],
  BALANCE: [
    "Center of gravity: stable",
    "Postural sway: 3.2mm (excellent)",
    "Core engagement: active",
    "Weight distribution: even",
    "Proprioception: high",
  ],
  IDLE: ["Resting state detected", "Ready for next activity"],
};

export function ActivityContent() {
  const {
    currentSession,
    isTracking,
    elapsed,
    feedback,
    startSession,
    stopSession,
    updateElapsed,
    clearFeedback,
  } = useActivityStore();
  const { addNotification } = useUIStore();

  const [selectedType, setSelectedType] = useState<ActivityType>("WALKING");
  const [saving, setSaving] = useState(false);
  const [lastResult, setLastResult] = useState<{
    xpEarned: number;
    newBadges: { name: string; icon: string }[];
    leveledUp: boolean;
    newLevel: number;
  } | null>(null);

  const [liveIntensity, setLiveIntensity] = useState(0.5);
  const [aiMessage, setAiMessage] = useState("Waiting for movement...");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isTracking && currentSession) {
      intervalRef.current = setInterval(() => {
        const seconds = Math.floor(
          (Date.now() - currentSession.startTime) / 1000
        );
        updateElapsed(seconds);

        // Simulate AI intensity fluctuation
        setLiveIntensity((prev) =>
          Math.max(0.15, Math.min(1.0, prev + (Math.random() - 0.48) * 0.1))
        );

        // Rotate AI messages
        const msgs =
          AI_MESSAGES[currentSession.type] ?? AI_MESSAGES["IDLE"];
        setAiMessage(msgs[Math.floor(Math.random() * msgs.length)]);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLiveIntensity(0.5);
      setAiMessage("Waiting for movement...");
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking, currentSession, updateElapsed]);

  const handleStart = () => {
    setLastResult(null);
    startSession(selectedType);
  };

  const handleStop = async () => {
    const session = stopSession();
    if (!session) return;

    setSaving(true);
    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: session.type,
          duration: session.duration,
          intensity: session.intensity,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setLastResult({
        xpEarned: data.xpEarned,
        newBadges: data.newBadges ?? [],
        leveledUp: data.leveledUp,
        newLevel: data.newLevel,
      });

      queryClient.invalidateQueries({ queryKey: ["activity-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });

      addNotification(`+${data.xpEarned} XP earned! Great session 🎉`, "success");

      if (data.leveledUp) {
        addNotification(
          `🏆 Level up! You're now Level ${data.newLevel}!`,
          "success"
        );
      }

      if (data.newBadges?.length > 0) {
        addNotification(
          `🥇 New badge: ${data.newBadges[0].icon} ${data.newBadges[0].name}`,
          "info"
        );
      }
    } catch {
      addNotification("Failed to save activity. Please try again.", "warning");
    } finally {
      setSaving(false);
    }
  };

  const estimatedXp = isTracking
    ? Math.max(1, Math.round(liveIntensity * (elapsed / 60) * 10))
    : 0;

  const activeTypeConfig = ACTIVITY_TYPES.find(
    (t) => t.type === (currentSession?.type ?? selectedType)
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Activity Tracker</h1>
        <p className="text-white/35 text-sm mt-1">
          AI-powered movement classification & XP earning
        </p>
      </div>

      {/* Activity type selector — only shown when not tracking */}
      <AnimatePresence>
        {!isTracking && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {ACTIVITY_TYPES.map((t) => (
              <motion.button
                key={t.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedType(t.type)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${t.borderColor} ${t.glowColor} ${
                  selectedType === t.type
                    ? "ring-2 ring-white/15 ring-offset-1 ring-offset-transparent"
                    : ""
                }`}
              >
                <div className="text-2xl mb-3">{getActivityIcon(t.type)}</div>
                <div className={`text-sm font-semibold ${t.textColor}`}>
                  {t.label}
                </div>
                <div className="text-[11px] text-white/30 mt-1">{t.desc}</div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main tracker card */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <AnimatePresence mode="wait">
          {isTracking ? (
            /* ── ACTIVE SESSION ── */
            <motion.div
              key="tracking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 text-center"
            >
              {/* Animated pulse rings */}
              <div className="relative inline-flex items-center justify-center mb-8">
                <div
                  className="absolute w-36 h-36 rounded-full bg-emerald-500/8 animate-ping"
                  style={{ animationDuration: "2.2s" }}
                />
                <div
                  className="absolute w-28 h-28 rounded-full bg-emerald-500/12 animate-ping"
                  style={{ animationDuration: "1.6s", animationDelay: "0.4s" }}
                />
                <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-3xl">
                    {getActivityIcon(currentSession?.type ?? "WALKING")}
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className="font-display text-6xl font-bold mb-2 tabular-nums tracking-tight">
                {formatDuration(elapsed)}
              </div>
              <p className="text-white/35 text-sm capitalize mb-8">
                {currentSession?.type?.toLowerCase()} session in progress
              </p>

              {/* Live AI panel */}
              <div className="glass rounded-xl p-5 mb-8 border border-emerald-500/10 text-left max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">
                      AI Movement Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </div>

                <motion.p
                  key={aiMessage}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-white/55 mb-4"
                >
                  {aiMessage}
                </motion.p>

                {/* Intensity bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/25 mb-1.5">
                    <span>Intensity</span>
                    <span>{Math.round(liveIntensity * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${liveIntensity * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/25 mb-8">
                Estimated XP:{" "}
                <span className="text-amber-400 font-bold text-base">
                  ~{estimatedXp}
                </span>
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStop}
                disabled={saving}
                className="inline-flex items-center gap-2.5 bg-red-500/80 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-2xl transition-colors"
              >
                <Square className="w-4 h-4" />
                {saving ? "Saving..." : "End Session"}
              </motion.button>
            </motion.div>
          ) : (
            /* ── IDLE / START ── */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 text-center"
            >
              <div className="text-5xl mb-4">
                {getActivityIcon(selectedType)}
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                {ACTIVITY_TYPES.find((t) => t.type === selectedType)?.label}
              </h3>
              <p className="text-white/35 text-sm mb-8">
                {ACTIVITY_TYPES.find((t) => t.type === selectedType)?.desc}
              </p>

              {/* Last result */}
              <AnimatePresence>
                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass rounded-xl p-5 mb-8 border border-emerald-500/20 bg-emerald-500/5 max-w-xs mx-auto"
                  >
                    <div className="flex items-center gap-2 justify-center mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold text-sm">
                        Session saved!
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center text-amber-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="font-display font-bold text-xl">
                        +{lastResult.xpEarned} XP
                      </span>
                    </div>
                    {lastResult.leveledUp && (
                      <p className="text-xs text-violet-400 font-medium">
                        🏆 Leveled up to Level {lastResult.newLevel}!
                      </p>
                    )}
                    {lastResult.newBadges.map((b) => (
                      <p key={b.name} className="text-xs text-cyan-400 mt-1">
                        {b.icon} {b.name} badge unlocked!
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 32px rgba(34,197,94,0.35)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-12 py-4 rounded-2xl text-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                Start{" "}
                {ACTIVITY_TYPES.find((t) => t.type === selectedType)?.label}
              </motion.button>

              <div className="mt-8 flex items-start gap-2 text-left max-w-sm mx-auto glass rounded-xl p-4 border border-white/5">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/30">
                  Start a session and our AI will analyze your movement in
                  real-time, classifying intensity and awarding XP automatically.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Feedback card */}
      <AnimatePresence>
        {feedback && (
          <AIFeedbackCard feedback={feedback} onClose={clearFeedback} />
        )}
      </AnimatePresence>
    </div>
  );
}
