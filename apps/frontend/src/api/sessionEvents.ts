import type { AuthSession } from "@/types/auth";

type SessionRefreshedHandler = (session: AuthSession) => void;

type SessionExpiredHandler = () => void;

let refreshedHandler: SessionRefreshedHandler | null = null;
let expiredHandler: SessionExpiredHandler | null = null;

export const sessionEvents = {
  onSessionRefreshed: (handler: SessionRefreshedHandler): (() => void) => {
    refreshedHandler = handler;

    return () => {
      if (refreshedHandler === handler) {
        refreshedHandler = null;
      }
    };
  },
  onSessionExpired: (handler: SessionExpiredHandler): (() => void) => {
    expiredHandler = handler;

    return () => {
      if (expiredHandler === handler) {
        expiredHandler = null;
      }
    };
  },
  emitSessionRefreshed: (session: AuthSession): void => {
    refreshedHandler?.(session);
  },
  emitSessionExpired: (): void => {
    expiredHandler?.();
  }
};
