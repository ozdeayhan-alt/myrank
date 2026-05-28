import { RANKINGS_FILTER_ALL_LABEL } from '../../constants/rankingsPage'

interface RankingsAllOptionProps {
  active: boolean
  onSelect: () => void
  className?: string
}

export default function RankingsAllOption({
  active,
  onSelect,
  className = 'mb-2',
}: RankingsAllOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl border
        ${className}
        ${active
          ? 'border-blue-600 text-blue-600 bg-slate-50'
          : 'border-slate-200 text-gray-700 bg-white'
        }
      `}
    >
      {RANKINGS_FILTER_ALL_LABEL}
    </button>
  )
}
