"use client";

import { motion } from "framer-motion";
import { X, Brain, Lightbulb } from "lucide-react";
import { AIFeedback } from "@/types";

interface Props {
  feedback: AIFeedback;
  onClose: () => void;
}

const intensityStyles = {
  low: "border-cyan-500/25 bg-cyan-500/5",
  medium: "border-emerald-500/25 bg-emerald-500/5",
  high: "border-rose-500/25 bg-rose-500/5",
};

const intensityLabels = {
  low: { text: "Low Intensity", color: "text-cyan-400 bg-cyan-500/10" },
  medium: { text: "Medium Intensity", color: "text-emerald-400 bg-emerald-500/10" },
  high: { text: "High Intensity", color: "text-rose-400 bg-rose-500/10" },
};

export function AIFeedbackCard({ feedback, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
      className={`glass rounded-2xl p-6 border ${intensityStyles[feedback.intensity]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">AI Coach Feedback</p>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                intensityLabels[feedback.intensity].color
              }`}
            >
              {intensityLabels[feedback.intensity].text}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/25 hover:text-white/60 transition-colors p-1 rounded-lg hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">{feedback.emoji}</span>
          <p className="text-white/80 font-medium leading-relaxed">
            {feedback.message}
          </p>
        </div>

        <div className="flex items-start gap-3 pl-12">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/40 italic leading-relaxed">
            {feedback.suggestion}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
