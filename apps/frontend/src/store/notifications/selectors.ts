import type { NotificationStore } from "@/store/notifications/useNotificationStore";

const notifications = (state: NotificationStore) => state.notifications;

const notifyAction = (state: NotificationStore) => state.notify;

const dismissAction = (state: NotificationStore) => state.dismiss;

export const notificationSelectors = {
  notifications,
  notifyAction,
  dismissAction
};
