// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyATrbJoJP0yrUy10JEO-nS-00eXXsCqiQM",
  authDomain: "react-pushnotifications-1.firebaseapp.com",
  projectId: "react-pushnotifications-1",
  storageBucket: "react-pushnotifications-1.appspot.com",
  messagingSenderId: "258384220882",
  appId: "1:258384220882:web:b5653f2d8804ae6ced130b",
  measurementId: "G-GCC12ETRPH",
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
        "BCeVFir6FEoMffD1AAgG1EYkEPStf3zap6Icd2uV73hr5Mtl0DYDIAH8kKLlmVg_cZc4tIH_-OUuXO6Mp9a_4U4",
    });
    console.log(token);
  }
};
