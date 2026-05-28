import { useApp } from '../context/AppContext'
import {
  formatScoreLabel,
  getPostScore,
  getScoreColorClass,
} from '../types/post'

interface PostScoreBadgeProps {
  postId: string
}

export default function PostScoreBadge({ postId }: PostScoreBadgeProps) {
  const { getPost } = useApp()
  const post = getPost(postId)
  if (!post) return null

  const score = getPostScore(post)

  return (
    <span
      className={`
        absolute top-2 right-2 z-10
        px-2 py-0.5 rounded-lg
        bg-white border border-[#e2e8f0]
        text-sm font-bold tabular-nums
        ${getScoreColorClass(score)}
      `}
    >
      {formatScoreLabel(score)}
    </span>
  )
}
