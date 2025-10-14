import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Helper function to conditionally join class names and resolve conflicts
 * from Tailwind CSS classes.
 * @param inputs Class values to merge
 * @returns A merged string of class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}