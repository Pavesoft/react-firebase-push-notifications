// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_APP_ID",
  measurementId: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "REPLACE_WITH_YOUR_VAPID_KEY",
    });
    console.log(token);
  }
};
