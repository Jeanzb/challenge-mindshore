import { create } from "zustand";
import {
  initialNotificationState,
  type NotificationStoreState,
  type NotificationTone
} from "@/store/notifications/initialState";

export type NotificationStoreAction = {
  notify: (message: string, tone?: NotificationTone) => void;
  dismiss: (id: string) => void;
};

export type NotificationStore = NotificationStoreState & NotificationStoreAction;

const createNotificationId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useNotificationStore = create<NotificationStore>()((set) => ({
  ...initialNotificationState,
  notify: (message, tone = "info") => {
    set((state) => ({
      notifications: [...state.notifications, { id: createNotificationId(), message, tone }]
    }));
  },
  dismiss: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id)
    }));
  }
}));
