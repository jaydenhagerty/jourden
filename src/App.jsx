import { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import TextBox from "./components/TextBox";
import { listenForAuth } from "./auth.js";
import { db } from "./firebase.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsubscribe = listenForAuth((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

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
      <nav className="fixed top-0 left-0 w-full flex justify-between">
        <h1 className={`text-4xl font-fancy ${user ? "opacity-0" : "text-b3"}`}>
          Jourden
        </h1>
        
        {user && (
          <div className="flex gap-2">
            <button
              onClick={saveEntry}
              className="p-4 text-b3 rounded-lg cursor-pointer flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faFloppyDisk} className="text-2xl" />
              Save
            </button>
          </div>
        )}
      </nav>

      <div className="flex justify-center items-center min-h-screen px-3">
        <div className="w-full max-w-[700px] text-3xl">
          {user ? (
            <TextBox value={text} onChange={setText} />
          ) : (
            <LoginButton onSignIn={setUser} />
          )}
        </div>
      </div>

      
    </main>
  );
}

export default App;