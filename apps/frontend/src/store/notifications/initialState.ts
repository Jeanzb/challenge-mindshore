export type NotificationTone = "info" | "success" | "error";

export type AppNotification = {
  id: string;
  message: string;
  tone: NotificationTone;
};

export type NotificationStoreState = {
  notifications: AppNotification[];
};

export const initialNotificationState: NotificationStoreState = {
  notifications: []
};
