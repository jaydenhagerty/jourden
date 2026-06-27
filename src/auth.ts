import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return user;
}