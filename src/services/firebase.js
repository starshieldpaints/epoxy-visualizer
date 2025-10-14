import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";

const requiredKeys = [
  "REACT_APP_FIREBASE_API_KEY",
  "REACT_APP_FIREBASE_AUTH_DOMAIN",
  "REACT_APP_FIREBASE_PROJECT_ID",
  "REACT_APP_FIREBASE_APP_ID"
];

let appInstance;
let dbInstance;

function readFirebaseConfig() {
  return {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };
}

function hasConfig() {
  return requiredKeys.every(key => {
    const value = process.env[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

export function initFirebase() {
  if (appInstance && dbInstance) {
    return { app: appInstance, db: dbInstance };
  }

  if (!hasConfig()) {
    console.warn(
      "Firebase configuration missing. Set REACT_APP_FIREBASE_* variables to enable lead capture."
    );
    return null;
  }

  const config = readFirebaseConfig();
  appInstance = initializeApp(config);
  dbInstance = getFirestore(appInstance);
  return { app: appInstance, db: dbInstance };
}

export async function saveLead(lead) {
  const instance = initFirebase();

  if (!instance) {
    throw new Error(
      "Firebase is not configured. Provide REACT_APP_FIREBASE_* environment variables to enable submissions."
    );
  }

  const { db } = instance;
  const payload = {
    ...lead,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, "epoxyLeads"), payload);
  return docRef;
}

export function isFirebaseConfigured() {
  return Boolean(initFirebase());
}
