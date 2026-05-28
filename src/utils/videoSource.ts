import type { AppPost } from '../types/post'
import { SIMULATE_VIDEO_SRC } from '../constants/videoAssets'

export function getVideoPlaybackSrc(post: AppPost): string {
  if (
    post.mediaUrl &&
    (post.mediaUrl.startsWith('blob:') ||
      post.mediaUrl.startsWith('data:') ||
      post.mediaUrl.endsWith('.mp4') ||
      post.mediaUrl.endsWith('.webm'))
  ) {
    return post.mediaUrl
  }
  return SIMULATE_VIDEO_SRC
}
