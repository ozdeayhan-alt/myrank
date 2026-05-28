export type RankingsCategoryKey =
  | 'country'
  | 'city'
  | 'gender'
  | 'age'
  | 'profession'
  | 'maritalStatus'

export interface RankingsPageFilters {
  country: string | null
  city: string | null
  gender: string | null
  ageGroup: string | null
  profession: string | null
  maritalStatus: string | null
}

export const EMPTY_RANKINGS_FILTERS: RankingsPageFilters = {
  country: null,
  city: null,
  gender: null,
  ageGroup: null,
  profession: null,
  maritalStatus: null,
}

export const RANKINGS_CATEGORY_LABELS: Record<RankingsCategoryKey, string> =
  {
    country: 'Ülke',
    city: 'Şehir',
    gender: 'Cinsiyet',
    age: 'Yaş',
    profession: 'Meslek',
    maritalStatus: 'Medeni Durum',
  }

export const RANKINGS_CATEGORY_ORDER: RankingsCategoryKey[] = [
  'country',
  'city',
  'gender',
  'age',
  'profession',
  'maritalStatus',
]
