// Import the required Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "bank-time.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "bank-time.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app (singleton)
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== "undefined") {
  // Analytics only works in browser environments
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export Firebase services
export { app, analytics, auth, provider };

