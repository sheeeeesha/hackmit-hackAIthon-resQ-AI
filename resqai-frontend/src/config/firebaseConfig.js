// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBgGbmAMHvZgorIHb8lcuRzUCdr5x3qHQE",
//   authDomain: "resqai-4700b.firebaseapp.com",
//   projectId: "resqai-4700b",
//   storageBucket: "resqai-4700b.firebasestorage.app",
//   messagingSenderId: "827851701489",
//   appId: "1:827851701489:web:61930e2fb44fa3c207bd50",
//   measurementId: "G-1Q63ZN9MVN"
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore database
// const db = getFirestore(app);

// // Initialize Analytics only if running on the client-side
// let analytics;
// if (typeof window !== "undefined") {
//   import("firebase/analytics").then((module) => {
//     if (module.isSupported) {
//       module.isSupported().then((supported) => {
//         if (supported) {
//           analytics = getAnalytics(app);
//         }
//       });
//     }
//   });
// }

// export { db };


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
