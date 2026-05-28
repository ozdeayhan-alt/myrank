export interface RankedUser {
  id: string
  username: string
  country: string
  city: string
  gender: string
  age: string
  profession: string
  maritalStatus: string
  interests: string
  totalPoints: number
}

export type RankingFilterKey =
  | 'country'
  | 'city'
  | 'gender'
  | 'age'
  | 'profession'
  | 'maritalStatus'
  | 'interests'

export type RankingFilters = Record<RankingFilterKey, string>

export const RANKING_FILTER_ALL = 'Tümü'

export const RANKING_FILTER_LABELS: Record<RankingFilterKey, string> = {
  country: 'Ülke',
  city: 'Şehir',
  gender: 'Cinsiyet',
  age: 'Yaş',
  profession: 'Meslek',
  maritalStatus: 'Medeni Durum',
  interests: 'İlgi Alanları',
}

export const DEFAULT_RANKING_FILTERS: RankingFilters = {
  country: RANKING_FILTER_ALL,
  city: RANKING_FILTER_ALL,
  gender: RANKING_FILTER_ALL,
  age: RANKING_FILTER_ALL,
  profession: RANKING_FILTER_ALL,
  maritalStatus: RANKING_FILTER_ALL,
  interests: RANKING_FILTER_ALL,
}
