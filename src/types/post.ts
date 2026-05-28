export type PostType = 'tweet' | 'video' | 'photo'

export type ComboDirection = 'like' | 'dislike' | null

export interface AppPost {
  id: string
  userId: string
  author: string
  type: PostType
  content: string
  mediaUrl?: string
  createdAt: string
  likes: number
  dislikes: number
  comboDirection: ComboDirection
  comboCount: number
  lastServerAction: string | null
}

export type NewPostInput = {
  type: PostType
  content: string
  mediaUrl?: string
}

export function getPostScore(post: AppPost): number {
  return post.likes - post.dislikes
}

export function getScoreColorClass(score: number): string {
  if (score > 0) return 'text-blue-600'
  if (score < 0) return 'text-red-600'
  return 'text-gray-500'
}

export function formatScoreLabel(score: number): string {
  return `${score > 0 ? '+' : ''}${score}`
}
