import type { MyLeagueCard } from '../../utils/myLeagues'

interface MyLeaguesPanelProps {
  leagues: MyLeagueCard[]
}

function rankColorClass(rank: number): string {
  if (rank <= 3) return 'text-red-600'
  return 'text-blue-600'
}

export default function MyLeaguesPanel({ leagues }: MyLeaguesPanelProps) {
  return (
    <section
      aria-label="Lig sıralamaları"
      className="px-4 pt-1 pb-4 bg-white"
    >
      <div className="grid grid-cols-2 gap-3">
        {leagues.map((league) => (
          <article
            key={league.id}
            className="
              flex flex-col items-center justify-center
              min-h-[88px] p-3
              bg-white rounded-xl border border-slate-200
              shadow-none
            "
          >
            <p className="text-xs text-center text-gray-600 leading-snug">
              {league.contextLine}
            </p>
            <p
              className={`
                mt-2 text-sm font-bold text-center tabular-nums
                ${rankColorClass(league.rank)}
              `}
            >
              {league.rankLine}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
