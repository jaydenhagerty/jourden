import { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import TextBox from "./components/TextBox";
import { consumeRedirectResult, listenForAuth } from "./auth.js";
import { db } from "./firebase.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    void consumeRedirectResult();

    const unsubscribe = listenForAuth((user) => {
      setUser(user);
      setAuthLoading(false);
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

  useEffect(() => {
    if (authLoading) {
      setShowLoadingOverlay(true);
      return;
    }

    const id = setTimeout(() => {
      setShowLoadingOverlay(false);
    }, 400);

    return () => clearTimeout(id);
  }, [authLoading]);

  async function saveEntry() {
    if (!user || !text.trim()) return;

    await addDoc(collection(db, "users", user.uid, "entries"), {
      content: text,
      createdAt: serverTimestamp(),
    });

    setText(""); // clear after save
  }

  return (
    <main className="relative min-h-screen">
      <nav className="sticky top-0 left-0 w-full flex flex-col z-10">
        <div className="w-full flex justify-between bg-bg h-20">
          <h1 className={`text-4xl font-fancy ${user ? "opacity-0" : "text-b3"}`}>
            Jourden
          </h1>
          
          {user && (
            <div className="flex gap-2">
              <button
                onClick={saveEntry}
                className="p-4 text-b3 rounded-lg cursor-pointer flex flex-col items-center"
              >
                <FontAwesomeIcon icon={faFloppyDisk} className="text-4xl" />
                {/* Save */}
              </button>
            </div>
          )}
        </div>
        <div className="bg-linear-to-b from-bg to-transparent w-full h-16"></div>
      </nav>

      <div
        className={`
          flex
          justify-center
          items-center
          px-4
          py-16
          transition-opacity
          duration-300
          ${authLoading ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        
        {user ? (
          <TextBox value={text} onChange={setText} />
        ) : (
          <LoginButton onSignIn={setUser} />
        )}
      </div>

      {showLoadingOverlay && (
        <div
          className={`
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-bg
            text-fg
            transition-opacity
            duration-400
            ease-out
            ${authLoading ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
        </div>
      )}

      
    </main>
  );
}

export default App;