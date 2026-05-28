import RankingsAllOption from './RankingsAllOption'

interface RankingsOptionListProps {
  options: string[]
  selected: string | null
  onSelect: (value: string) => void
  onSelectAll: () => void
}

export default function RankingsOptionList({
  options,
  selected,
  onSelect,
  onSelectAll,
}: RankingsOptionListProps) {
  const allActive = selected === null

  return (
    <div>
      <RankingsAllOption active={allActive} onSelect={onSelectAll} />
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg border
                ${active
                  ? 'border-blue-600 text-blue-600 bg-white'
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
