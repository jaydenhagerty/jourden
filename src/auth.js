import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";

let persistencePromise;

function ensurePersistence() {
  if (!persistencePromise) {
    persistencePromise = setPersistence(auth, browserLocalPersistence).catch(() =>
      setPersistence(auth, browserSessionPersistence)
    );
  }

  return persistencePromise;
}

// Start persistence setup early, but keep sign-in click path gesture-safe.
void ensurePersistence();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    const code = error?.code || "";
    const shouldFallbackToRedirect =
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request";

    if (!shouldFallbackToRedirect) {
      throw error;
    }

    await ensurePersistence();
    await signInWithRedirect(auth, googleProvider);
    return null;
  }
}

export async function consumeRedirectResult() {
  try {
    return await getRedirectResult(auth);
  } catch {
    return null;
  }
}

export function listenForAuth(callback) {
  return onAuthStateChanged(auth, callback);
}