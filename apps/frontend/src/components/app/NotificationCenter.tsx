import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { notificationSelectors, useNotificationStore } from "@/store";
import type { AppNotification, NotificationTone } from "@/store";

const dismissDelayMs = 3800;

const toneIcon: Record<NotificationTone, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  error: AlertTriangle
};

const toneClass: Record<NotificationTone, string> = {
  info: "border-space-cyan/30 text-space-cyan",
  success: "border-space-cyan/30 text-space-cyan",
  error: "border-space-orange/40 text-space-orange"
};

export function NotificationCenter() {
  const notifications = useNotificationStore(notificationSelectors.notifications);
  const dismiss = useNotificationStore(notificationSelectors.dismissAction);

  if (notifications.length === 0) {
    return null;
  }

  const renderToast = (notification: AppNotification) => (
    <NotificationToast key={notification.id} notification={notification} onDismiss={dismiss} />
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex flex-col items-center gap-2 px-4">
      {notifications.map(renderToast)}
    </div>
  );
}

type NotificationToastProps = {
  notification: AppNotification;
  onDismiss: (id: string) => void;
};

function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const Icon = toneIcon[notification.tone];

  useEffect(() => {
    const timeout = setTimeout(() => onDismiss(notification.id), dismissDelayMs);

    return () => clearTimeout(timeout);
  }, [notification.id, onDismiss]);

  const handleDismiss = () => {
    onDismiss(notification.id);
  };

  return (
    <div
      className={cn(
        "cosmara-fade-in pointer-events-auto flex max-w-md items-center gap-3 rounded-full border bg-space-panelStrong/95 px-4 py-2 text-sm font-medium text-white shadow-2xl shadow-black/40 backdrop-blur-xl",
        toneClass[notification.tone]
      )}
      role="status"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-white">{notification.message}</span>
      <button
        type="button"
        className="ml-1 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-white"
        aria-label="Dismiss notification"
        onClick={handleDismiss}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
