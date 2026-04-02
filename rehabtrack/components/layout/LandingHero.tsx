"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Activity,
  Zap,
  Trophy,
  Brain,
  ArrowRight,
  Shield,
  TrendingUp,
  Flame,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    label: "AI Movement Analysis",
    desc: "Real-time classification of walking, stretching, strength & balance exercises",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Zap,
    label: "XP & Levels",
    desc: "Earn experience points for every session and level up as you recover",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Trophy,
    label: "Live Leaderboard",
    desc: "Compete with other patients to stay motivated during rehabilitation",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: Shield,
    label: "Badges & Streaks",
    desc: "Unlock achievements and maintain streaks to build lasting habits",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const stats = [
  { value: "2,400+", label: "Active Patients" },
  { value: "94%", label: "Recovery Rate" },
  { value: "18M+", label: "XP Earned" },
  { value: "4.9★", label: "Patient Rating" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LandingHero() {
  return (
    <div className="min-h-screen bg-[#070a12] overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[700px] h-[500px] rounded-full bg-emerald-500/4 blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[400px] rounded-full bg-cyan-500/4 blur-[120px]" />
        <div className="absolute top-2/3 left-0 w-[400px] h-[300px] rounded-full bg-violet-500/4 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">RehabTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Get Started Free
            </motion.button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Hero */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center pt-20 pb-16"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-emerald-400 mb-10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Rehabilitation Platform — Now Live
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-6xl md:text-7xl xl:text-8xl font-bold leading-[1.05] mb-7"
          >
            Recover Smarter.
            <br />
            <span className="text-gradient">Level Up Faster.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white/45 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Track every movement, earn XP for progress, and climb the leaderboard.
            Your rehabilitation journey — gamified and AI-powered.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(34,197,94,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
              >
                Start Recovering <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 glass border border-white/10 hover:border-white/20 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
              >
                Try Demo
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-6 border border-white/5 text-center"
            >
              <div className="font-display text-3xl font-bold text-gradient mb-1">{s.value}</div>
              <div className="text-white/35 text-sm">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`glass rounded-2xl p-6 border ${f.border} cursor-default`}
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-display font-semibold mb-2 text-[15px]">{f.label}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass rounded-3xl p-8 border border-white/5 mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mb-4">
                <TrendingUp className="w-3 h-3" />
                Live Activity Feed
              </div>
              <h2 className="font-display text-3xl font-bold mb-4">
                Watch your progress in{" "}
                <span className="text-gradient">real-time</span>
              </h2>
              <p className="text-white/40 leading-relaxed mb-6">
                Our AI engine classifies your movements the moment you start. Every step, 
                stretch, and rep is tracked and instantly converted into XP.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🚶", type: "Walking", xp: "+80 XP", color: "text-emerald-400" },
                  { icon: "🧘", type: "Stretching", xp: "+40 XP", color: "text-cyan-400" },
                  { icon: "💪", type: "Strength", xp: "+120 XP", color: "text-rose-400" },
                ].map((item) => (
                  <div key={item.type} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-white/70">{item.type}</span>
                    <span className={`ml-auto text-sm font-bold ${item.color}`}>{item.xp}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {/* Fake dashboard preview */}
              <div className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/30">Daily Progress</span>
                  <span className="text-xs text-emerald-400 font-bold">73%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "73%" }}
                    transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Current Level", value: "7", icon: <Zap className="w-4 h-4 text-amber-400" /> },
                  { label: "Day Streak", value: "12", icon: <Flame className="w-4 h-4 text-orange-400" /> },
                ].map((card) => (
                  <div key={card.label} className="glass rounded-xl p-4 border border-white/5">
                    {card.icon}
                    <div className="font-display text-2xl font-bold mt-2">{card.value}</div>
                    <div className="text-xs text-white/30 mt-0.5">{card.label}</div>
                  </div>
                ))}
              </div>
              <div className="glass rounded-xl p-4 border border-amber-500/15 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">New Badge Earned!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <div className="text-sm font-medium">Week Warrior</div>
                    <div className="text-xs text-white/30">7-day streak achieved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center pb-24"
        >
          <h2 className="font-display text-4xl font-bold mb-4">
            Ready to start your recovery?
          </h2>
          <p className="text-white/40 mb-8">
            Join thousands of patients already leveling up their rehabilitation.
          </p>
          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-2xl text-lg transition-colors inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <p className="text-white/20 text-sm mt-4">
            Demo account available • No credit card required
          </p>
        </motion.div>
      </main>
    </div>
  );
}
