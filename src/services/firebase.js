// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   addDoc,
//   collection,
//   serverTimestamp,
// } from "firebase/firestore";

// const requiredKeys = [
//   "REACT_APP_FIREBASE_API_KEY",
//   "REACT_APP_FIREBASE_AUTH_DOMAIN",
//   "REACT_APP_FIREBASE_PROJECT_ID",
//   "REACT_APP_FIREBASE_APP_ID",
// ];

// let appInstance;
// let dbInstance;

// function readFirebaseConfig() {
//   return {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
//   };
// }

// function hasConfig() {
//   return requiredKeys.every((key) => {
//     const value = process.env[key];
//     return typeof value === "string" && value.trim().length > 0;
//   });
// }

// export function initFirebase() {
//   if (appInstance && dbInstance) {
//     return { app: appInstance, db: dbInstance };
//   }

//   if (!hasConfig()) {
//     console.warn(
//       "Firebase configuration missing. Set REACT_APP_FIREBASE_* environment variables."
//     );
//     return null;
//   }

//   const config = readFirebaseConfig();
//   appInstance = initializeApp(config);
//   dbInstance = getFirestore(appInstance);

//   return { app: appInstance, db: dbInstance };
// }

// export async function saveLead(lead) {
//   const instance = initFirebase();
//   if (!instance) {
//     throw new Error("Firebase not initialised. Missing environment settings.");
//   }

//   const { db } = instance;
//   const payload = {
//     ...lead,
//     name: lead?.name?.trim() || "",
//     email: lead?.email?.trim() || "",
//     phone: lead?.phone?.replace(/\s+/g, "").trim() || "",
//     zip: lead?.zip?.trim() || "",
//     createdAt: serverTimestamp(),
//   };

//   const docRef = await addDoc(collection(db, "epoxyLeads"), payload);
//   return docRef;
// }


























// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Required environment variables
const requiredKeys = [
  "REACT_APP_FIREBASE_API_KEY",
  "REACT_APP_FIREBASE_AUTH_DOMAIN",
  "REACT_APP_FIREBASE_PROJECT_ID",
  "REACT_APP_FIREBASE_APP_ID",
];

let appInstance;
let dbInstance;
let authInstance;

// Read Firebase config from environment
function readFirebaseConfig() {
  return {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
}

// Ensure required env vars are present
function hasConfig() {
  return requiredKeys.every((key) => {
    const value = process.env[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

// Initialize Firebase App, Firestore, and Auth
export function initFirebase() {
  if (appInstance && dbInstance && authInstance) {
    return { app: appInstance, db: dbInstance, auth: authInstance };
  }

  if (!hasConfig()) {
    console.warn(
      "Firebase configuration missing. Set REACT_APP_FIREBASE_* environment variables."
    );
    return null;
  }

  const config = readFirebaseConfig();
  appInstance = initializeApp(config);
  dbInstance = getFirestore(appInstance);
  authInstance = getAuth(appInstance);

  return { app: appInstance, db: dbInstance, auth: authInstance };
}

// Export initialized instances
const instance = initFirebase();
export const db = instance?.db;
export const auth = instance?.auth;

if (auth && process.env.NODE_ENV === "development") {
  try {
    auth.settings.appVerificationDisabledForTesting = true;
  } catch (err) {
    console.warn("Unable to disable app verification for testing", err);
  }
}

// Utility function to save leads
export async function saveLead(lead) {
  if (!db) throw new Error("Firestore not initialized");

  const payload = {
    ...lead,
    name: lead?.name?.trim() || "",
    email: lead?.email?.trim() || "",
    phone: lead?.phone?.replace(/\s+/g, "").trim() || "",
    zip: lead?.zip?.trim() || "",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "epoxyLeads"), payload);
  return docRef;
}
