import { signInWithGoogle } from "../auth.js";

export default function LoginButton({ onSignIn }) {
  async function handleSignIn() {
    const user = await signInWithGoogle();
    onSignIn?.(user);
  }

  return (
    <div className="flex justify-center">
      <button onClick={handleSignIn} className="p-8 cursor-pointer">
        Sign in
      </button>
    </div>
  );
}