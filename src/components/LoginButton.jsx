import { signInWithGoogle } from "../auth";

export default function LoginButton({ onSignIn }) {
  async function handleSignIn() {
    const user = await signInWithGoogle();
    onSignIn?.(user);
  }

  return (
    <button onClick={handleSignIn}>
      Sign in with Google
    </button>
  );
}