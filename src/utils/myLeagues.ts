import type { RegisterProfile } from '../types'
import type { RankedUser } from '../types/ranking'
import {
  ageMatchesGroup,
  getAgeGroupLabel,
  normalizeGenderForFilter,
} from './rankingsPageFilters'
import {
  ageGroupContextLine,
  cityContextLine,
  countryContextLine,
  formatRankLine,
  genderContextLine,
  maritalContextLine,
  professionContextLine,
} from './leagueLabels'

export interface MyLeagueCard {
  id: string
  contextLine: string
  rankLine: string
  rank: number
}

function rankInPool(
  board: RankedUser[],
  username: string,
  match: (user: RankedUser) => boolean,
): number {
  const pool = board
    .filter(match)
    .sort((a, b) => b.totalPoints - a.totalPoints)
  const idx = pool.findIndex((u) => u.username === username)
  return idx >= 0 ? idx + 1 : pool.length + 1
}

/** Aktif kullanıcının 6 alt ligdeki anlık sıralaması */
export function computeMyLeagues(
  rankings: RankedUser[],
  profile: RegisterProfile,
  username: string,
): MyLeagueCard[] {
  const board = [...rankings].sort((a, b) => b.totalPoints - a.totalPoints)
  const ageGroup = getAgeGroupLabel(profile.age)
  const normalizedGender = normalizeGenderForFilter(profile.gender)

  const countryRank = rankInPool(
    board,
    username,
    (u) => u.country === profile.country,
  )

  const cityRank = rankInPool(
    board,
    username,
    (u) => u.country === profile.country && u.city === profile.city,
  )

  const professionRank = rankInPool(
    board,
    username,
    (u) => u.profession === profile.profession,
  )

  const ageRank = ageGroup
    ? rankInPool(board, username, (u) => ageMatchesGroup(u.age, ageGroup))
    : rankInPool(board, username, (u) => u.age === profile.age)

  const genderRank = rankInPool(
    board,
    username,
    (u) => normalizeGenderForFilter(u.gender) === normalizedGender,
  )

  const maritalRank = rankInPool(
    board,
    username,
    (u) => u.maritalStatus === profile.maritalStatus,
  )

  const cards: { id: string; contextLine: string; rank: number }[] = [
    {
      id: 'country',
      contextLine: countryContextLine(profile.country),
      rank: countryRank,
    },
    {
      id: 'city',
      contextLine: cityContextLine(profile.city),
      rank: cityRank,
    },
    {
      id: 'profession',
      contextLine: professionContextLine(profile.profession),
      rank: professionRank,
    },
    {
      id: 'age',
      contextLine: ageGroup
        ? ageGroupContextLine(ageGroup)
        : `${profile.age} yaş grubunda`,
      rank: ageRank,
    },
    {
      id: 'gender',
      contextLine: genderContextLine(profile.gender),
      rank: genderRank,
    },
    {
      id: 'maritalStatus',
      contextLine: maritalContextLine(profile.maritalStatus),
      rank: maritalRank,
    },
  ]

  return cards.map((card) => ({
    ...card,
    rankLine: formatRankLine(card.rank),
  }))
}
