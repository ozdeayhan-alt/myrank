import {
  RANKING_FILTER_LABELS,
  type RankingFilterKey,
} from '../../types/ranking'

const CATEGORIES: RankingFilterKey[] = [
  'country',
  'city',
  'gender',
  'age',
  'profession',
  'maritalStatus',
  'interests',
]

interface ExploreCategoryBarProps {
  openCategory: RankingFilterKey | null
  activeFilterKey: RankingFilterKey | null
  onSelectCategory: (key: RankingFilterKey) => void
}

export default function ExploreCategoryBar({
  openCategory,
  activeFilterKey,
  onSelectCategory,
}: ExploreCategoryBarProps) {
  return (
    <div
      className="
        flex overflow-x-auto gap-x-2 pb-1
        [-ms-overflow-style:none] [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
      "
    >
      {CATEGORIES.map((key) => {
        const isOpen = openCategory === key
        const isFiltered = activeFilterKey === key

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectCategory(key)}
            className={`
              shrink-0 px-3 py-1.5 text-xs font-medium
              rounded-xl border bg-white
              ${isOpen || isFiltered
                ? 'border-blue-600 text-blue-600'
                : 'border-slate-200 text-gray-600'
              }
            `}
          >
            {RANKING_FILTER_LABELS[key]}
          </button>
        )
      })}
    </div>
  )
}
