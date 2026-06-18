import { Timestamp } from "firebase/firestore";

export const FIREBASE_PERMISSION_HELP =
  "Firebase permission denied. Publish firestore.rules and storage.rules in the Firebase Console (Firestore → Rules, Storage → Rules), or set FIREBASE_SERVICE_ACCOUNT_KEY in .env.";

export function toMillis(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof (value as { toMillis: () => number }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (value instanceof Timestamp) {
    return value.toMillis();
  }
  if (typeof value === "number") {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "seconds" in value &&
    typeof (value as { seconds: number }).seconds === "number"
  ) {
    return (value as { seconds: number }).seconds * 1000;
  }
  return Date.now();
}

export function wrapFirebaseError(error: unknown): never {
  const message =
    error instanceof Error ? error.message : "Unknown Firebase error";

  if (message.includes("PERMISSION_DENIED") || message.includes("permission")) {
    throw new Error(FIREBASE_PERMISSION_HELP);
  }

  throw error instanceof Error ? error : new Error(message);
}
