import { create } from "zustand";
import { ActivityType, ActivitySession, AIFeedback } from "@/types";
import { getActivityXp, getAIFeedback } from "@/lib/utils";

interface ActivityStore {
  currentSession: ActivitySession | null;
  sessionHistory: ActivitySession[];
  isTracking: boolean;
  elapsed: number;
  feedback: AIFeedback | null;
  totalXpEarned: number;
  startSession: (type: ActivityType) => void;
  stopSession: () => ActivitySession | null;
  updateElapsed: (seconds: number) => void;
  clearFeedback: () => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  currentSession: null,
  sessionHistory: [],
  isTracking: false,
  elapsed: 0,
  feedback: null,
  totalXpEarned: 0,

  startSession: (type: ActivityType) => {
    const intensity = 0.3 + Math.random() * 0.7; // Simulated intensity
    set({
      currentSession: {
        type,
        startTime: Date.now(),
        duration: 0,
        intensity,
        xpEarned: 0,
        isActive: true,
      },
      isTracking: true,
      elapsed: 0,
      feedback: null,
    });
  },

  stopSession: () => {
    const { currentSession, elapsed, sessionHistory } = get();
    if (!currentSession) return null;

    const intensity = currentSession.intensity;
    const xpEarned = getActivityXp(currentSession.type, elapsed, intensity);
    const feedback = getAIFeedback(currentSession.type, intensity, elapsed);

    const completedSession: ActivitySession = {
      ...currentSession,
      duration: elapsed,
      xpEarned,
      isActive: false,
    };

    set({
      currentSession: null,
      isTracking: false,
      elapsed: 0,
      feedback,
      sessionHistory: [completedSession, ...sessionHistory.slice(0, 9)],
      totalXpEarned: get().totalXpEarned + xpEarned,
    });

    return completedSession;
  },

  updateElapsed: (seconds: number) => {
    set({ elapsed: seconds });
  },

  clearFeedback: () => {
    set({ feedback: null });
  },
}));

interface UIStore {
  sidebarOpen: boolean;
  theme: "dark" | "light";
  notifications: Array<{ id: string; message: string; type: "success" | "info" | "warning" }>;
  toggleSidebar: () => void;
  addNotification: (message: string, type?: "success" | "info" | "warning") => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarOpen: true,
  theme: "dark",
  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addNotification: (message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    // Auto remove after 4 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
