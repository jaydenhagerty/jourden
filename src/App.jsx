import { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import TextBox from "./components/TextBox";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore();

function App() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!user) return;

    async function initUser() {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          createdAt: new Date(),
        },
        { merge: true }
      );
    }

    initUser();
  }, [user]);

  async function saveEntry() {
    if (!user || !text.trim()) return;

    await addDoc(collection(db, "users", user.uid, "entries"), {
      content: text,
      createdAt: serverTimestamp(),
    });

    setText(""); // clear after save
  }

  return (
    <main className="relative">
      <h1 className="text-4xl font-fancy fixed top-0 left-0 px-3 py-2">
        Jourden
      </h1>

      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-[700px]">
          {user ? (
            <TextBox value={text} onChange={setText} />
          ) : (
            <LoginButton onSignIn={setUser} />
          )}
        </div>
      </div>

      {user && (
        <button
          onClick={saveEntry}
          className="fixed bottom-6 right-6 px-4 py-2 bg-black text-white rounded-lg"
        >
          Save
        </button>
      )}
    </main>
  );
}

export default App;