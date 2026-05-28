import { useState } from 'react'
import type { RankedUser } from '../../types/ranking'
import type { RankingsCategoryKey, RankingsPageFilters } from '../../types/rankingsPage'
import { RANKINGS_CATEGORY_LABELS } from '../../types/rankingsPage'
import {
  RANKINGS_AGE_GROUPS,
  RANKINGS_GENDER_OPTIONS,
  RANKINGS_MARITAL_OPTIONS,
} from '../../constants/rankingsPage'
import {
  getCityOptions,
  getCountryOptions,
  getProfessionOptions,
} from '../../utils/rankingsPageFilters'
import RankingsSearchList from './RankingsSearchList'
import RankingsOptionList from './RankingsOptionList'

interface RankingsFilterPanelProps {
  category: RankingsCategoryKey
  filters: RankingsPageFilters
  rankings: RankedUser[]
  onFilterChange: (patch: Partial<RankingsPageFilters>) => void
  onClearCategory: () => void
}

export default function RankingsFilterPanel({
  category,
  filters,
  rankings,
  onFilterChange,
  onClearCategory,
}: RankingsFilterPanelProps) {
  const [search, setSearch] = useState('')

  const renderContent = () => {
    switch (category) {
      case 'country': {
        const countries = getCountryOptions(rankings)
        return (
          <RankingsSearchList
            scrollable
            searchPlaceholder="Ülke ara..."
            search={search}
            onSearchChange={setSearch}
            options={countries}
            selected={filters.country}
            onSelectAll={() => {
              onFilterChange({ country: null, city: null })
              setSearch('')
            }}
            onSelect={(value) => {
              onFilterChange({ country: value, city: null })
              setSearch('')
            }}
          />
        )
      }
      case 'city': {
        if (!filters.country) {
          return (
            <p className="text-xs text-gray-400">
              Önce bir ülke seçin.
            </p>
          )
        }
        const cities = getCityOptions(rankings, filters.country)
        return (
          <RankingsSearchList
            scrollable
            searchPlaceholder="Şehir ara..."
            search={search}
            onSearchChange={setSearch}
            options={cities}
            selected={filters.city}
            onSelectAll={() => {
              onFilterChange({ city: null })
              setSearch('')
            }}
            onSelect={(value) => {
              onFilterChange({ city: value })
              setSearch('')
            }}
          />
        )
      }
      case 'gender':
        return (
          <RankingsOptionList
            options={RANKINGS_GENDER_OPTIONS}
            selected={filters.gender}
            onSelectAll={() => onFilterChange({ gender: null })}
            onSelect={(value) => onFilterChange({ gender: value })}
          />
        )
      case 'age':
        return (
          <RankingsOptionList
            options={RANKINGS_AGE_GROUPS}
            selected={filters.ageGroup}
            onSelectAll={() => onFilterChange({ ageGroup: null })}
            onSelect={(value) => onFilterChange({ ageGroup: value })}
          />
        )
      case 'profession': {
        const professions = getProfessionOptions(rankings)
        return (
          <RankingsSearchList
            scrollable
            searchPlaceholder="Meslek ara..."
            search={search}
            onSearchChange={setSearch}
            options={professions}
            selected={filters.profession}
            onSelectAll={() => {
              onFilterChange({ profession: null })
              setSearch('')
            }}
            onSelect={(value) => {
              onFilterChange({ profession: value })
              setSearch('')
            }}
          />
        )
      }
      case 'maritalStatus':
        return (
          <RankingsOptionList
            options={RANKINGS_MARITAL_OPTIONS}
            selected={filters.maritalStatus}
            onSelectAll={() => onFilterChange({ maritalStatus: null })}
            onSelect={(value) => onFilterChange({ maritalStatus: value })}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className="
        mt-3 p-3 bg-white border border-slate-200
        rounded-xl
      "
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">
          {RANKINGS_CATEGORY_LABELS[category]} seç
        </span>
        <button
          type="button"
          onClick={onClearCategory}
          className="text-xs font-medium text-red-600"
        >
          Temizle
        </button>
      </div>
      {renderContent()}
    </div>
  )
}
