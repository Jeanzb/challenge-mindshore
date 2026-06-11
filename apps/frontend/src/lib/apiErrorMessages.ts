import { ApiError } from "@/api";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const extractApiErrorMessages = (error: unknown): string[] => {
  if (error instanceof ApiError && typeof error.details === "object" && error.details !== null) {
    const fieldErrors = (error.details as { errors?: unknown }).errors;

    if (typeof fieldErrors === "object" && fieldErrors !== null) {
      const messages = Object.values(fieldErrors).flatMap((value) => (isStringArray(value) ? value : []));

      if (messages.length > 0) {
        return messages;
      }
    }
  }

  return error instanceof Error ? [error.message] : [];
};
