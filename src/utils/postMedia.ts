import type { AppPost } from '../types/post'

const TWEET_GRID_PLACEHOLDER =
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7a984?w=400&q=80'

const VIDEO_GRID_PLACEHOLDER =
  'https://images.unsplash.com/photo-1611162617474-5b21e939e113?w=400&q=80'

export function getPostGridImage(post: AppPost): string {
  if (post.mediaUrl) return post.mediaUrl
  if (post.type === 'video') return VIDEO_GRID_PLACEHOLDER
  return TWEET_GRID_PLACEHOLDER
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
