import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string | Date | undefined | null, fallback = "Unknown date") {
  if (!value) return fallback
  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function getYear(value: string | Date | undefined | null) {
  if (!value) return null
  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  return date.getFullYear()
}

export function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}...`
}
