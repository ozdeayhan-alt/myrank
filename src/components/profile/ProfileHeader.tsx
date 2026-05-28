interface ProfileHeaderProps {
  displayName: string
  avatarUrl: string
  worldRank: number
  totalPoints: number
}

export default function ProfileHeader({
  displayName,
  avatarUrl,
  worldRank,
  totalPoints,
}: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center pt-6 pb-4 px-4 bg-white">
      <img
        src={avatarUrl}
        alt={displayName}
        width={88}
        height={88}
        className="
          w-[88px] h-[88px] rounded-full object-cover
          border border-[#e2e8f0]
        "
      />
      <h1 className="mt-3 text-lg font-bold text-neutral-900">
        {displayName}
      </h1>
      <p className="mt-1 text-sm font-semibold text-blue-600">
        Dünya: #{worldRank}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">
        Toplam puan: {totalPoints.toLocaleString('tr-TR')}
      </p>
    </header>
  )
}
