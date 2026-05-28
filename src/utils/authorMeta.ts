import { RANKING_USERS } from '../data/rankingUsers'
import type { RegisterProfile } from '../types'
import type { RankingFilterKey } from '../types/ranking'

export interface AuthorMeta {
  country: string
  city: string
  gender: string
  age: string
  profession: string
  maritalStatus: string
  interests: string
}

const SYSTEM_AUTHORS: Record<string, AuthorMeta> = {
  myrank_resmi: {
    country: 'Türkiye',
    city: 'İstanbul',
    gender: 'Belirtmek istemiyorum',
    age: '25',
    profession: 'Platform',
    maritalStatus: 'Bekar',
    interests: 'Teknoloji',
  },
}

export function getAuthorMeta(
  username: string,
  profile?: RegisterProfile,
): AuthorMeta | null {
  if (profile && profile.username === username) {
    return {
      country: profile.country,
      city: profile.city,
      gender: profile.gender,
      age: profile.age,
      profession: profile.profession,
      maritalStatus: profile.maritalStatus,
      interests: profile.interests,
    }
  }

  const ranked = RANKING_USERS.find((u) => u.username === username)
  if (ranked) {
    return {
      country: ranked.country,
      city: ranked.city,
      gender: ranked.gender,
      age: ranked.age,
      profession: ranked.profession,
      maritalStatus: ranked.maritalStatus,
      interests: ranked.interests,
    }
  }

  return SYSTEM_AUTHORS[username] ?? null
}

export function matchesCategoryFilter(
  meta: AuthorMeta | null,
  key: RankingFilterKey,
  value: string,
): boolean {
  if (!meta) return false
  if (key === 'interests') {
    return meta.interests.toLowerCase().includes(value.toLowerCase())
  }
  return meta[key] === value
}
