import { initializeApp } from 'firebase/app'
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

console.log('Firebase initialized with projectId:', firebaseConfig.projectId)
console.log('Firebase config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
})

export const auth = getAuth(app)

// Use browser language for OAuth flows and persist auth state locally.
auth.useDeviceLanguage()
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Failed to set Firebase auth persistence:', error)
})

export const db = getFirestore(app, {
  experimentalForceLongPolling: true,
})
export const googleProvider = new GoogleAuthProvider()

export function observeAuthState(
  callback: (user: FirebaseUser | null) => void,
) {
  return onAuthStateChanged(auth, callback)
}

export { firebaseConfig }
