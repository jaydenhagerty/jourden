import {
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";

setPersistence(auth, browserLocalPersistence).catch(() => {
  // Keep sign-in usable even if persistence setup is unavailable.
});

export async function signInWithGoogle() {
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobileDevice) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }

  const result = await signInWithPopup(auth, googleProvider);

  return result.user;
}

export function listenForAuth(callback) {
  return onAuthStateChanged(auth, callback);
}