import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { RegisterProfile } from '../types'

export type UserProfileRecord = RegisterProfile & {
  uid?: string
  email?: string
  isOnboarded?: boolean
}

export async function getUserProfile(
  uid: string,
): Promise<UserProfileRecord | null> {
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    return null
  }

  const data = snap.data()
  return {
    uid: String(data.uid ?? uid),
    email: String(data.email ?? ''),
    username: String(data.username ?? ''),
    fullName: String(data.fullName ?? ''),
    country: String(data.country ?? 'Türkiye'),
    city: String(data.city ?? 'İstanbul'),
    gender: String(data.gender ?? 'Belirtmek istemiyorum'),
    age: String(data.age ?? '25'),
    profession: String(data.profession ?? 'Kullanıcı'),
    maritalStatus: String(data.maritalStatus ?? 'Bekar'),
    interests: String(data.interests ?? 'Teknoloji'),
    isOnboarded: Boolean(data.isOnboarded),
  }
}

export async function saveUserProfile(
  uid: string,
  profile: RegisterProfile,
  email?: string,
): Promise<void> {
  await setDoc(
    doc(db, 'users', uid),
    {
      uid,
      email: email ?? '',
      username: profile.username,
      fullName: profile.fullName ?? '',
      interests: profile.interests,
      country: profile.country,
      city: profile.city,
      gender: profile.gender,
      age: profile.age,
      profession: profile.profession,
      maritalStatus: profile.maritalStatus,
      isOnboarded: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
