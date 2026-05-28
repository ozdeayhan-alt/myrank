import RankingsAllOption from './RankingsAllOption'

interface RankingsSearchListProps {
  searchPlaceholder: string
  search: string
  onSearchChange: (value: string) => void
  options: string[]
  selected: string | null
  onSelect: (value: string) => void
  onSelectAll: () => void
  /** Uzun listeler için dikey kaydırma */
  scrollable?: boolean
}

const SCROLL_LIST_CLASS = `
  max-h-60 overflow-y-auto
  border border-slate-200 rounded-xl
  rankings-thin-scroll
`

export default function RankingsSearchList({
  searchPlaceholder,
  search,
  onSearchChange,
  options,
  selected,
  onSelect,
  onSelectAll,
  scrollable = false,
}: RankingsSearchListProps) {
  const q = search.trim().toLowerCase()
  const filtered = q
    ? options.filter((o) => o.toLowerCase().includes(q))
    : options
  const allActive = selected === null

  if (scrollable) {
    return (
      <div>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="
            w-full px-3 py-2 mb-2 text-sm rounded-xl
            border border-slate-200 bg-white
            focus:outline-none focus:border-blue-600
          "
        />
        <RankingsAllOption active={allActive} onSelect={onSelectAll} />
        <div className={SCROLL_LIST_CLASS}>
          {filtered.length === 0 ? (
            <p className="text-xs text-gray-500 py-3 px-3">
              Sonuç bulunamadı.
            </p>
          ) : (
            filtered.map((opt) => {
              const active = selected === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onSelect(opt)}
                  className={`
                    w-full text-left px-3 py-2.5 text-sm
                    border-b border-slate-100 last:border-b-0
                    ${active
                      ? 'text-blue-600 font-medium bg-slate-50'
                      : 'text-gray-700 bg-white'
                    }
                  `}
                >
                  {opt}
                </button>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="
          w-full px-3 py-2 mb-2 text-sm rounded-xl
          border border-slate-200 bg-white
          focus:outline-none focus:border-blue-600
        "
      />
      <RankingsAllOption active={allActive} onSelect={onSelectAll} />
      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto rankings-thin-scroll">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-500 py-2">Sonuç bulunamadı.</p>
        ) : (
          filtered.map((opt) => {
            const active = selected === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onSelect(opt)}
                className={`
                  px-2.5 py-1 text-xs font-medium rounded-lg border
                  ${active
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-slate-200 text-gray-600 bg-white'
                  }
                `}
              >
                {opt}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
