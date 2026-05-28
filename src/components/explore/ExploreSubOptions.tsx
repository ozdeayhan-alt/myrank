import type { RankingFilterKey } from '../../types/ranking'
import { RANKING_FILTER_LABELS } from '../../types/ranking'

interface ExploreSubOptionsProps {
  category: RankingFilterKey
  options: string[]
  selectedValue: string | null
  onSelect: (value: string) => void
  onClear: () => void
}

export default function ExploreSubOptions({
  category,
  options,
  selectedValue,
  onSelect,
  onClear,
}: ExploreSubOptionsProps) {
  return (
    <div
      className="
        bg-white border border-slate-200
        rounded-xl p-3
      "
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">
          {RANKING_FILTER_LABELS[category]} seç
        </span>
        {selectedValue && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-red-600 font-medium"
          >
            Temizle
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selectedValue === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`
                px-2.5 py-1 text-xs rounded-lg border
                ${active
                  ? 'border-red-600 text-red-600 bg-white'
                  : 'border-slate-200 text-gray-600 bg-white'
                }
              `}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
