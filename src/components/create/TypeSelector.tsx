import type { PostType } from '../../types/post'

const TABS: { id: PostType; label: string; activeClass: string }[] = [
  { id: 'tweet', label: 'Tweet', activeClass: 'border-blue-600 text-blue-600' },
  {
    id: 'video',
    label: '33sn Video',
    activeClass: 'border-red-600 text-red-600',
  },
  {
    id: 'photo',
    label: 'Fotoğraf',
    activeClass: 'border-blue-600 text-blue-600',
  },
]

interface TypeSelectorProps {
  value: PostType
  onChange: (type: PostType) => void
}

export default function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="flex border border-[#e2e8f0] rounded-xl overflow-hidden bg-white">
      {TABS.map((tab) => {
        const active = value === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 py-3 text-sm font-medium
              border-b-2 bg-white
              ${active
                ? tab.activeClass
                : 'border-transparent text-gray-500'
              }
            `}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
