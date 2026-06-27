// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwHTwmFOtzaF_YNDK2Of76K3GANUyMSUc",
  authDomain: "jour-den.firebaseapp.com",
  projectId: "jour-den",
  storageBucket: "jour-den.firebasestorage.app",
  messagingSenderId: "535334798326",
  appId: "1:535334798326:web:b9ae8ca5f7d44f99c57dd7",
  measurementId: "G-YL31PKQYC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { app, analytics };