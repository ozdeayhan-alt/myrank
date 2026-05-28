import type { RankedUser, RankingFilters } from '../types/ranking'
import { RANKING_FILTER_ALL } from '../types/ranking'

export function isGlobalRanking(filters: RankingFilters): boolean {
  return Object.values(filters).every((v) => v === RANKING_FILTER_ALL)
}

function matchesField(
  userValue: string,
  filterValue: string,
): boolean {
  if (filterValue === RANKING_FILTER_ALL) return true
  return userValue === filterValue
}

export function filterRankedUsers(
  users: RankedUser[],
  filters: RankingFilters,
): RankedUser[] {
  return users.filter((user) => {
    if (!matchesField(user.country, filters.country)) return false
    if (!matchesField(user.city, filters.city)) return false
    if (!matchesField(user.gender, filters.gender)) return false
    if (!matchesField(user.age, filters.age)) return false
    if (!matchesField(user.profession, filters.profession)) return false
    if (!matchesField(user.maritalStatus, filters.maritalStatus)) return false
    if (filters.interests !== RANKING_FILTER_ALL) {
      const ok = user.interests
        .toLowerCase()
        .includes(filters.interests.toLowerCase())
      if (!ok) return false
    }
    return true
  })
}

export function formatUserCategories(user: RankedUser): string {
  return [
    user.country,
    user.city,
    user.gender,
    `${user.age} yaş`,
    user.profession,
    user.maritalStatus,
    user.interests,
  ].join(' · ')
}
