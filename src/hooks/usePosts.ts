import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import {
  createPost,
  subscribeToPosts,
  voteOnPost as voteOnPostService,
} from '../services/PostService'
import { applyVoteToPost } from '../utils/comboEngine'
import { dedupePostsById, normalizePost } from '../utils/normalizePost'
import { INITIAL_POSTS } from '../data/initialPosts'
import { EXPLORE_SEED_POSTS } from '../data/exploreSeedPosts'
import type { AppPost, NewPostInput } from '../types/post'
import type { AuthUser } from '../types'

function buildInitialPosts(): AppPost[] {
  return dedupePostsById(
    [...INITIAL_POSTS, ...EXPLORE_SEED_POSTS].map((p) => normalizePost(p)),
  )
}

function stablePostForComparison(post: AppPost) {
  return {
    ...post,
    mediaUrl: post.mediaUrl ?? '',
  }
}

export function usePosts(user: AuthUser | null, isFirebaseReady: boolean) {
  const [posts, setPosts] = useLocalStorage<AppPost[]>(
    'myrank1-posts',
    buildInitialPosts(),
  )
  const [pendingPosts, setPendingPosts] = useState<AppPost[]>([])
  const postsRef = useRef<AppPost[]>(posts)
  const postsSnapshotUnsubscribeRef = useRef<() => void>(() => {})
  const postsSyncPausedRef = useRef(false)
  const postsSyncActiveRef = useRef(false)

  const normalizedPosts = useMemo(() => {
    const merged = [...posts, ...pendingPosts].map((p) => normalizePost(p))
    return dedupePostsById(merged)
  }, [posts, pendingPosts])

  useEffect(() => {
    postsRef.current = posts
  }, [posts])

  const detachPostsSnapshotListener = useCallback(() => {
    if (!postsSyncActiveRef.current) return
    postsSnapshotUnsubscribeRef.current()
    postsSyncActiveRef.current = false
    postsSnapshotUnsubscribeRef.current = () => {}
  }, [])

  const attachPostsSnapshotListener = useCallback(() => {
    if (!isFirebaseReady || !user?.id || postsSyncPausedRef.current) return
    if (postsSyncActiveRef.current) return

    postsSyncActiveRef.current = true
    const unsubscribe = subscribeToPosts(
      (nextPosts) => {
        const currentPostsJson = JSON.stringify(
          postsRef.current.map(stablePostForComparison),
        )
        const nextPostsJson = JSON.stringify(
          nextPosts.map(stablePostForComparison),
        )
        if (currentPostsJson !== nextPostsJson) {
          setPosts(nextPosts)
        }
      },
      (error) => {
        const runtimeMaybe =
          typeof window !== 'undefined'
            ? (window as any).runtime ??
              (window as any).chrome?.runtime ??
              (window as any).browser?.runtime
            : undefined
        if (runtimeMaybe?.lastError) return

        const err = error as any
        if (err?.code === 'cancelled' || err?.name === 'AbortError') {
          return
        }
        if (err?.message?.includes('AbortError')) {
          return
        }
        console.error('PostService.subscribeToPosts error:', error)
      },
    )

    postsSnapshotUnsubscribeRef.current = () => {
      unsubscribe()
      postsSyncActiveRef.current = false
    }
  }, [isFirebaseReady, user?.id, setPosts])

  const pausePostsSync = useCallback(() => {
    if (postsSyncPausedRef.current) return
    postsSyncPausedRef.current = true
    detachPostsSnapshotListener()
  }, [detachPostsSnapshotListener])

  const resumePostsSync = useCallback(() => {
    if (!postsSyncPausedRef.current) return
    postsSyncPausedRef.current = false
    attachPostsSnapshotListener()
  }, [attachPostsSnapshotListener])

  useEffect(() => {
    attachPostsSnapshotListener()
    return () => detachPostsSnapshotListener()
  }, [attachPostsSnapshotListener, detachPostsSnapshotListener])

  const addPost = useCallback(
    async (input: NewPostInput): Promise<AppPost> => {
      pausePostsSync()
      const tempId = `temp-${Date.now()}`
      const optimisticPost = normalizePost({
        id: tempId,
        userId: user?.id ?? 'guest',
        author: user?.username ?? 'anonim',
        type: input.type,
        content: input.content.trim(),
        mediaUrl: input.mediaUrl,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        comboDirection: null,
        comboCount: 0,
        lastServerAction: null,
      })

      setPendingPosts((prev) => [optimisticPost, ...prev])

      try {
        const docId = await createPost(input, user)

        setPendingPosts((prev) =>
          prev.map((pending) =>
            pending.id === tempId ? { ...pending, id: docId } : pending,
          ),
        )

        return { ...optimisticPost, id: docId }
      } catch (error) {
        console.error('PostService.createPost failed:', error)
        setPendingPosts((prev) => prev.filter((p) => p.id !== tempId))
        throw error
      } finally {
        resumePostsSync()
      }
    },
    [user, pausePostsSync, resumePostsSync],
  )

  const voteOnPost = useCallback(
    async (postId: string, type: 'like' | 'dislike') => {
      const existingPost = normalizedPosts.find((p) => p.id === postId)
      if (!existingPost) return

      const updatedPost = applyVoteToPost(normalizePost(existingPost), type)

      if (postId.startsWith('temp-')) return

      try {
        await voteOnPostService(postId, {
          likes: updatedPost.likes,
          dislikes: updatedPost.dislikes,
          comboDirection: updatedPost.comboDirection,
          comboCount: updatedPost.comboCount,
          lastServerAction: updatedPost.lastServerAction,
        })
      } catch (error) {
        console.error('PostService.voteOnPost failed:', error)
      }
    },
    [normalizedPosts],
  )

  return {
    posts: normalizedPosts,
    addPost,
    voteOnPost,
  }
}
