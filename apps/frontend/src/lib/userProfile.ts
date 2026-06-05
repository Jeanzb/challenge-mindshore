import type { AuthenticatedUser } from "@/types/auth";

export const fallbackExplorerName = "Katherine Johnson";

export const getUserDisplayName = (user: AuthenticatedUser | null): string =>
  user?.displayName.trim() || fallbackExplorerName;

export const getUserInitials = (user: AuthenticatedUser | null): string => {
  const displayName = getUserDisplayName(user);
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join("");

  return initials || "KJ";
};
