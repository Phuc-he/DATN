// src/infrastructure/config/firebase.config.ts
import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// 1. Define the configuration with the FirebaseOptions type
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDJP9EIHG535YtjSCQlr99klS167VxmN5M",
  authDomain: "datn-54d30.firebaseapp.com",
  projectId: "datn-54d30",
  storageBucket: "datn-54d30.firebasestorage.app",
  messagingSenderId: "98920300369",
  appId: "1:98920300369:web:a15ecd32fa43a3d4411d70",
  measurementId: "G-2Z7QKQDWFC"
};

// 2. Initialize with explicit types
const app: FirebaseApp = initializeApp(firebaseConfig);

// 3. Analytics requires a check because it doesn't run in SSR (Server-Side Rendering)
let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };