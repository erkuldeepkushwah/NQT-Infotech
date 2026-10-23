import { deleteApp, getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// The config is read from environment variables so the values stay out of the
// source repository. Copy `.env.local.example` to `.env.local` and fill it in.
//
// Note: Firebase web config is public by design - it ships inside the browser
// bundle no matter how it is stored. Your data is protected by Firestore
// Security Rules and API key restrictions, not by hiding these values.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Without these the site still builds and renders - the contact form and login
// simply report that they are not connected yet.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export const auth = authInstance;
export const db = dbInstance;

/**
 * Creates a student account from the admin panel without disturbing the admin's
 * own session.
 *
 * Firebase signs the new account in on whichever app instance creates it, so
 * this runs on a throwaway secondary app and signs straight back out of it.
 * Returns the new user's uid.
 */
export async function createUserAsAdmin(
  email: string,
  password: string,
  displayName: string
): Promise<string> {
  const secondary = initializeApp(firebaseConfig, "admin-create-" + Date.now());
  try {
    const secondaryAuth = getAuth(secondary);
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    const uid = credential.user.uid;
    await signOut(secondaryAuth);
    return uid;
  } finally {
    await deleteApp(secondary);
  }
}
