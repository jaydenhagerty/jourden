import {
  signInWithPopup,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";

export async function signInWithGoogle() {
  await setPersistence(auth, browserLocalPersistence);

  const result = await signInWithPopup(auth, googleProvider);

  return result.user;
}

export function listenForAuth(callback) {
  return onAuthStateChanged(auth, callback);
}