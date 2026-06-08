/**
 * Firebase web app config from Firebase Console → Project settings → Your apps.
 * https://firebase.google.com/docs/web/setup
 */
export const firebaseWebConfig = {
  apiKey: "AIzaSyCsvsFdptPV2p9ulxS4AXILbdoECg_2Hxo",
  authDomain: "music-hub-4d45b.firebaseapp.com",
  projectId: "music-hub-4d45b",
  storageBucket: "music-hub-4d45b.firebasestorage.app",
  messagingSenderId: "728366954804",
  appId: "1:728366954804:web:4117baa02d452aa196cd61",
  measurementId: "G-208ZYWK9ZD",
} as const;

export const FIREBASE_PROJECT_ID = firebaseWebConfig.projectId;
export const FIREBASE_STORAGE_BUCKET = firebaseWebConfig.storageBucket;
