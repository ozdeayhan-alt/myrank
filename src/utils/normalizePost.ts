import type { AppPost } from '../types/post'

export function normalizePost(
  raw: Partial<AppPost> &
    Pick<
      AppPost,
      'id' | 'userId' | 'author' | 'type' | 'content' | 'createdAt'
    >,
): AppPost {
  return {
    id: raw.id,
    userId: raw.userId,
    author: raw.author,
    type: raw.type,
    content: raw.content,
    createdAt: raw.createdAt,
    mediaUrl: raw.mediaUrl,
    likes: raw.likes ?? 0,
    dislikes: raw.dislikes ?? 0,
    comboDirection: raw.comboDirection ?? null,
    comboCount: raw.comboCount ?? 0,
    lastServerAction: raw.lastServerAction ?? null,
  }
}

export function dedupePostsById(posts: AppPost[]): AppPost[] {
  const seen = new Set<string>()
  return posts.filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}
