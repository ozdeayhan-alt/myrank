import type { RankingsCategoryKey, RankingsPageFilters } from '../../types/rankingsPage'
import {
  RANKINGS_CATEGORY_LABELS,
  RANKINGS_CATEGORY_ORDER,
} from '../../types/rankingsPage'

interface RankingsCategoryBarProps {
  openCategory: RankingsCategoryKey | null
  filters: RankingsPageFilters
  onSelectCategory: (key: RankingsCategoryKey) => void
}

function hasValue(
  key: RankingsCategoryKey,
  filters: RankingsPageFilters,
): boolean {
  switch (key) {
    case 'country':
      return filters.country !== null
    case 'city':
      return filters.city !== null
    case 'gender':
      return filters.gender !== null
    case 'age':
      return filters.ageGroup !== null
    case 'profession':
      return filters.profession !== null
    case 'maritalStatus':
      return filters.maritalStatus !== null
    default:
      return false
  }
}

export default function RankingsCategoryBar({
  openCategory,
  filters,
  onSelectCategory,
}: RankingsCategoryBarProps) {
  const cityDisabled = !filters.country

  return (
    <div
      className="
        flex flex-wrap gap-2
        [-ms-overflow-style:none] [scrollbar-width:none]
      "
    >
      {RANKINGS_CATEGORY_ORDER.map((key) => {
        const isOpen = openCategory === key
        const hasFilter = hasValue(key, filters)
        const disabled = key === 'city' && cityDisabled

        let borderClass = 'border-slate-200 text-gray-600'
        if (disabled) {
          borderClass = 'border-slate-100 text-gray-300 cursor-not-allowed'
        } else if (isOpen) {
          borderClass = 'border-blue-600 text-blue-600'
        } else if (hasFilter) {
          borderClass = 'border-red-600 text-red-600'
        }

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) onSelectCategory(key)
            }}
            className={`
              shrink-0 px-3 py-2 text-xs font-medium
              rounded-xl border bg-white
              ${borderClass}
            `}
          >
            {RANKINGS_CATEGORY_LABELS[key]}
          </button>
        )
      })}
    </div>
  )
}
