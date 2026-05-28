import { Search } from 'lucide-react'

interface ExploreSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function ExploreSearchBar({
  value,
  onChange,
}: ExploreSearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={18}
        strokeWidth={1}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          text-gray-400 pointer-events-none
        "
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Keşfet'te ara..."
        className="
          w-full pl-10 pr-4 py-2.5 text-sm
          bg-white border border-slate-200 rounded-xl
          text-neutral-900 placeholder:text-gray-400
          focus:outline-none focus:border-blue-600
        "
      />
    </div>
  )
}
