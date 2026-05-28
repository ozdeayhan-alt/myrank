import type { RankedUser } from '../../types/ranking'
import { getAvatarUrl } from '../../utils/avatar'
import { formatRankingsUserTags } from '../../utils/rankingsPageFilters'

function rankClass(rank: number): string {
  if (rank === 1) return 'text-blue-600 font-bold'
  if (rank === 2) return 'text-neutral-700 font-bold'
  if (rank === 3) return 'text-red-600 font-bold'
  return 'text-neutral-500 font-semibold'
}

interface RankingsLeaderboardProps {
  users: RankedUser[]
}

export default function RankingsLeaderboard({
  users,
}: RankingsLeaderboardProps) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-center text-gray-500 py-12">
        Bu filtrelere uygun kullanıcı bulunamadı.
      </p>
    )
  }

  return (
    <ol className="space-y-2">
      {users.map((user, index) => {
        const rank = index + 1
        return (
          <li
            key={user.id}
            className="
              flex items-center gap-3 p-3
              bg-white border border-slate-200 rounded-xl
            "
          >
            <span
              className={`w-9 shrink-0 text-center text-sm ${rankClass(rank)}`}
            >
              #{rank}
            </span>
            <img
              src={getAvatarUrl(user.username)}
              alt=""
              className="
                w-10 h-10 shrink-0 rounded-full
                border border-slate-200 object-cover
              "
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                @{user.username}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
                {formatRankingsUserTags(user)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-blue-600 tabular-nums">
                {user.totalPoints.toLocaleString('tr-TR')}
              </p>
              <p className="text-[10px] text-gray-400">puan</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
