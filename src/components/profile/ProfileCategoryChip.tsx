import type { ProfileCategoryRank } from '../../types/profile'

interface ProfileCategoryChipProps {
  item: ProfileCategoryRank
}

export default function ProfileCategoryChip({
  item,
}: ProfileCategoryChipProps) {
  const rankClass =
    item.rank <= 3 ? 'text-blue-600' : 'text-neutral-900'

  return (
    <div
      className="
        shrink-0 w-[72px] py-2.5 px-2
        bg-white border border-[#e2e8f0] rounded-xl
        flex flex-col items-center justify-center
      "
    >
      <span className="text-[10px] text-gray-500 text-center leading-tight">
        {item.label}
      </span>
      <span
        className={`mt-1 text-sm font-bold tabular-nums ${rankClass}`}
      >
        #{item.rank}
      </span>
    </div>
  )
}
