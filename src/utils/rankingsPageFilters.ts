import {
  COUNTRY_CITIES,
  FALLBACK_CITIES,
} from '../constants/countryCities'
import {
  RANKINGS_PROFESSION_POOL,
  WORLD_COUNTRIES,
} from '../constants/rankingsPage'
import type { RankedUser } from '../types/ranking'
import type { RankingsPageFilters } from '../types/rankingsPage'

export function normalizeGenderForFilter(userGender: string): string {
  if (userGender === 'Erkek' || userGender === 'Kadın') return userGender
  return 'Diğer'
}

export const RANKINGS_AGE_GROUP_LABELS = [
  '18-25',
  '26-35',
  '36-45',
  '46+',
] as const

export function ageMatchesGroup(ageStr: string, group: string): boolean {
  const age = parseInt(ageStr, 10)
  if (Number.isNaN(age)) return false
  switch (group) {
    case '18-25':
      return age >= 18 && age <= 25
    case '26-35':
      return age >= 26 && age <= 35
    case '36-45':
      return age >= 36 && age <= 45
    case '46+':
      return age >= 46
    default:
      return false
  }
}

export function getAgeGroupLabel(ageStr: string): string | null {
  for (const group of RANKINGS_AGE_GROUP_LABELS) {
    if (ageMatchesGroup(ageStr, group)) return group
  }
  return null
}

export function filterRankingsLeaderboard(
  users: RankedUser[],
  filters: RankingsPageFilters,
): RankedUser[] {
  return users.filter((user) => {
    if (filters.country && user.country !== filters.country) return false
    if (filters.city && user.city !== filters.city) return false
    if (
      filters.gender &&
      normalizeGenderForFilter(user.gender) !== filters.gender
    ) {
      return false
    }
    if (filters.ageGroup && !ageMatchesGroup(user.age, filters.ageGroup)) {
      return false
    }
    if (filters.profession && user.profession !== filters.profession) {
      return false
    }
    if (
      filters.maritalStatus &&
      user.maritalStatus !== filters.maritalStatus
    ) {
      return false
    }
    return true
  })
}

export function getCountryOptions(users: RankedUser[]): string[] {
  const fromUsers = users.map((u) => u.country)
  return [...new Set([...WORLD_COUNTRIES, ...fromUsers])].sort((a, b) =>
    a.localeCompare(b, 'tr'),
  )
}

export function getCityOptions(
  users: RankedUser[],
  country: string,
): string[] {
  const staticCities = COUNTRY_CITIES[country] ?? FALLBACK_CITIES
  const fromUsers = users
    .filter((u) => u.country === country)
    .map((u) => u.city)
  return [...new Set([...staticCities, ...fromUsers])].sort((a, b) =>
    a.localeCompare(b, 'tr'),
  )
}

export function getProfessionOptions(users: RankedUser[]): string[] {
  const fromUsers = users.map((u) => u.profession)
  return [...new Set([...RANKINGS_PROFESSION_POOL, ...fromUsers])].sort(
    (a, b) => a.localeCompare(b, 'tr'),
  )
}

export function formatRankingsUserTags(user: RankedUser): string {
  return [
    user.country,
    user.city,
    normalizeGenderForFilter(user.gender),
    `${user.age} yaş`,
    user.profession,
    user.maritalStatus,
  ].join(' · ')
}

export function countActiveFilters(filters: RankingsPageFilters): number {
  return Object.values(filters).filter((v) => v !== null).length
}
