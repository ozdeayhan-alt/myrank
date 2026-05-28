import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useComboVote } from '../../hooks/useComboVote'

interface ComboVotePanelProps {
  postId: string
  layout?: 'inline' | 'fullscreen'
}

export default function ComboVotePanel({
  postId,
  layout = 'inline',
}: ComboVotePanelProps) {
  const {
    likes,
    dislikes,
    score,
    comboDirection,
    comboCount,
    comboTarget,
    lastServerAction,
    voteLike,
    voteDislike,
  } = useComboVote(postId)

  const showCombo = comboCount > 0
  const isFs = layout === 'fullscreen'

  return (
    <div
      className={isFs ? 'px-4 pb-8 pt-2' : ''}
      onClick={(e) => e.stopPropagation()}
    >
      {showCombo && (
        <div
          className="
            mb-2 px-3 py-2 rounded-xl
            border border-[#e2e8f0] bg-slate-50
          "
        >
          <p className="text-xs text-neutral-500">Anlık kombo</p>
          <p className="text-lg font-semibold text-neutral-900">
            {comboCount} / {comboTarget}
            <span className="text-sm font-normal text-neutral-600 ml-2">
              {comboDirection === 'like' ? 'Beğeni' : 'Beğenmeme'}
            </span>
          </p>
        </div>
      )}

      {!isFs && (
        <div className="px-3 pb-2 flex items-center gap-4 text-xs text-neutral-500">
          <span>Beğeni: {likes}</span>
          <span>Beğenmeme: {dislikes}</span>
          <span className="font-medium text-neutral-800">
            Puan: {score}
          </span>
        </div>
      )}

      <div className={`flex gap-2 ${isFs ? '' : 'px-3 pb-3'}`}>
        <button
          type="button"
          onClick={voteLike}
          className="
            flex-1 flex items-center justify-center gap-2
            py-3 rounded-xl text-sm font-medium
            bg-blue-600 text-white
          "
        >
          <ThumbsUp size={18} />
          Beğen
        </button>
        <button
          type="button"
          onClick={voteDislike}
          className="
            flex-1 flex items-center justify-center gap-2
            py-3 rounded-xl text-sm font-medium
            bg-red-600 text-white
          "
        >
          <ThumbsDown size={18} />
          Beğenme
        </button>
      </div>

      {lastServerAction && (
        <p
          className={`
            mt-2 text-xs text-neutral-600
            ${isFs ? '' : 'px-3 pb-3 border-t border-slate-100 pt-2'}
          `}
        >
          {lastServerAction}
        </p>
      )}
    </div>
  )
}
