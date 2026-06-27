import { signInWithGoogle } from "../auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function LoginButton({ onSignIn }) {
  async function handleSignIn() {
    const user = await signInWithGoogle();
    if (user) {
      onSignIn?.(user);
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full text-2xl flex flex-col justify-center items-center gap-6">
        <button onClick={handleSignIn} className="p-6 cursor-pointer bg-b2 text-t1 rounded-3xl flex gap-4 border-2 border-b3 items-center drop-shadow-xl transition-all hover:scale-105 hover:bg-b3 hover:border-b4">
          <FontAwesomeIcon icon={faUser} />
          Sign in
        </button>
    </div>
  );
}