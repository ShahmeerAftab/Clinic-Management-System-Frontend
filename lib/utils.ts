// Shared pure utility functions — safe to import anywhere

import axios from "axios";
import type { PopulatedPatient } from "@/frontend/types";

/** Format "2024-03-15T..." → "15 Mar 2024" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get 2-letter initials from a doctor's full name.
 * Skips honorifics like "Dr." at the start.
 * Example: "Dr. Sarah Mitchell" → "SM"
 */
export function getInitials(name: string): string {
  const words = name.split(" ");
  const nameWords = words.length > 1 ? words.slice(1) : words; // skip "Dr." prefix
  return nameWords
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Capitalize the first letter of a string: "admin" → "Admin" */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Safely pull a display name out of a possibly-unpopulated patientID/patientId field. */
export function getPatientName(
  patient: string | PopulatedPatient | null | undefined,
  fallback = "Unknown Patient"
): string {
  if (!patient) return fallback;
  if (typeof patient === "string") return fallback;
  return patient.name || fallback;
}

/** Pull a readable message out of a mutation/query error — prefers the server's JSON message/error field. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
