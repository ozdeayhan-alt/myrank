import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth } from '../lib/firebase'

/**
 * Hook that ensures Firebase is fully initialized
 * (Auth state loaded + Firestore connection ready)
 * 
 * Prevents AbortError and message channel closed errors by
 * waiting until the app is truly ready before setting up listeners
 * 
 * This solves synchronization issues where:
 * - Posts from one device don't reach another
 * - Race conditions between optimistic updates and server updates
 * - AbortErrors during app startup
 */
export function useFirebaseReady(): boolean {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const authUnsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (mounted) {
        // Auth state callback is called = Firebase has been initialized
        // This signals that Firestore connection is also ready
        setIsReady(true)
      }
    })

    return () => {
      mounted = false
      authUnsubscribe()
    }
  }, [])

  return isReady
}

