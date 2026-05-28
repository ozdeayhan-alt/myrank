import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import RankingsCategoryBar from '../components/rankings/RankingsCategoryBar'
import RankingsFilterPanel from '../components/rankings/RankingsFilterPanel'
import RankingsLeaderboard from '../components/rankings/RankingsLeaderboard'
import {
  EMPTY_RANKINGS_FILTERS,
  type RankingsCategoryKey,
  type RankingsPageFilters,
} from '../types/rankingsPage'
import {
  countActiveFilters,
  filterRankingsLeaderboard,
} from '../utils/rankingsPageFilters'

export default function Rankings() {
  const { rankings } = useApp()
  const [filters, setFilters] = useState<RankingsPageFilters>(
    EMPTY_RANKINGS_FILTERS,
  )
  const [openCategory, setOpenCategory] =
    useState<RankingsCategoryKey | null>(null)

  const leaderboard = useMemo(() => {
    const filtered = filterRankingsLeaderboard(rankings, filters)
    return [...filtered].sort((a, b) => b.totalPoints - a.totalPoints)
  }, [rankings, filters])

  const activeCount = countActiveFilters(filters)

  const handleCategoryClick = (key: RankingsCategoryKey) => {
    if (key === 'city' && !filters.country) return
    setOpenCategory((prev) => (prev === key ? null : key))
  }

  const handleFilterChange = (patch: Partial<RankingsPageFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch }
      if (patch.country === null) {
        next.city = null
      }
      return next
    })
    if (patch.country === null && openCategory === 'city') {
      setOpenCategory(null)
    }
  }

  const clearCategory = () => {
    if (!openCategory) return
    const patch: Partial<RankingsPageFilters> = {}
    switch (openCategory) {
      case 'country':
        patch.country = null
        patch.city = null
        break
      case 'city':
        patch.city = null
        break
      case 'gender':
        patch.gender = null
        break
      case 'age':
        patch.ageGroup = null
        break
      case 'profession':
        patch.profession = null
        break
      case 'maritalStatus':
        patch.maritalStatus = null
        break
    }
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  const resetAll = () => {
    setFilters(EMPTY_RANKINGS_FILTERS)
    setOpenCategory(null)
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 pb-6">
      <p className="text-xs text-gray-500 mb-4">
        Global liderlik · Kullanıcı Puanı = Tüm Gönderi Puanları
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">
            {activeCount === 0
              ? 'Tüm kullanıcılar'
              : `${activeCount} filtre aktif`}
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-medium text-red-600"
            >
              Tümünü sıfırla
            </button>
          )}
        </div>

        <RankingsCategoryBar
          openCategory={openCategory}
          filters={filters}
          onSelectCategory={handleCategoryClick}
        />

        {openCategory && (
          <RankingsFilterPanel
            category={openCategory}
            filters={filters}
            rankings={rankings}
            onFilterChange={handleFilterChange}
            onClearCategory={clearCategory}
          />
        )}
      </div>

      <p className="text-xs text-gray-500 mb-2">
        {leaderboard.length} kullanıcı
      </p>

      <RankingsLeaderboard users={leaderboard} />
    </div>
  )
}
