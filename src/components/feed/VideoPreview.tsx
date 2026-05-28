import { useEffect, useRef } from 'react'
import { getVideoPlaybackSrc } from '../../utils/videoSource'
import type { AppPost } from '../../types/post'

interface VideoPreviewProps {
  post: AppPost
  active?: boolean
  className?: string
}

export default function VideoPreview({
  post,
  active = false,
  className = '',
}: VideoPreviewProps) {
  const src = getVideoPlaybackSrc(post)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    if (active) {
      el.muted = false
      void el.play().catch(() => {
        el.muted = true
      })
      return
    }

    el.pause()
    el.muted = true
  }, [active, src])

  useEffect(() => {
    return () => {
      const el = videoRef.current
      if (!el) return
      el.pause()
      el.muted = true
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      className={`w-full h-full object-cover ${className}`}
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}
