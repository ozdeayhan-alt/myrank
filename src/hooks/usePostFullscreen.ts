import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import type { AppPost } from '../types/post'

export function usePostFullscreen(post: AppPost) {
  const { openFullScreenFeed } = useApp()
  return useCallback(() => {
    openFullScreenFeed(post.id, post.type)
  }, [openFullScreenFeed, post.id, post.type])
}
