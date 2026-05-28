import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import FullScreenPostSlide from './FullScreenPostSlide'

export default function FullScreenFeed() {
  const {
    fullScreenOpen,
    fullScreenPosts,
    fullScreenStartId,
    closeFullScreenFeed,
  } = useApp()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const startIndex = useMemo(
    () => fullScreenPosts.findIndex((p) => p.id === fullScreenStartId),
    [fullScreenPosts, fullScreenStartId],
  )

  useEffect(() => {
    if (!fullScreenOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [fullScreenOpen])

  useEffect(() => {
    if (!fullScreenOpen || !fullScreenStartId) return
    const el = document.getElementById(`fs-post-${fullScreenStartId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }, [fullScreenOpen, fullScreenStartId, fullScreenPosts.length])

  useEffect(() => {
    if (!fullScreenOpen) return
    setActiveIndex(startIndex >= 0 ? startIndex : 0)
  }, [fullScreenOpen, startIndex])

  useEffect(() => {
    if (!fullScreenOpen || !scrollRef.current) return

    const root = scrollRef.current
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('[data-fs-index]'),
    )
    if (sections.length === 0) return

    let rafId = 0
    const observer = new IntersectionObserver(
      (entries) => {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          const fullyVisible = entries
            .filter(
              (entry) =>
                entry.isIntersecting && entry.intersectionRatio >= 1,
            )
            .map((entry) =>
              Number(
                (entry.target as HTMLElement).dataset.fsIndex ?? '-1',
              ),
            )
            .find((idx) => idx >= 0)

          if (typeof fullyVisible === 'number') {
            setActiveIndex(fullyVisible)
          } else {
            setActiveIndex(-1)
          }
        })
      },
      {
        root,
        threshold: 1.0,
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [fullScreenOpen, fullScreenPosts.length])

  if (!fullScreenOpen) return null

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen bg-white">
      <button
        type="button"
        onClick={closeFullScreenFeed}
        aria-label="Geri"
        className="
          absolute top-3 left-3 z-[60]
          flex items-center justify-center
          w-9 h-9 rounded-full
          bg-white border border-[#e2e8f0]
          text-neutral-700
        "
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>

      <div
        ref={scrollRef}
        className="
          h-full w-full overflow-y-scroll
          snap-y snap-mandatory
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {fullScreenPosts.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            <p className="text-sm text-gray-500">İçerik bulunamadı.</p>
          </div>
        ) : (
          fullScreenPosts.map((post, index) => {
            const live = Math.abs(index - activeIndex) <= 1
            const active = index === activeIndex
            return (
              <div key={post.id} data-fs-index={index}>
                <FullScreenPostSlide
                  post={post}
                  active={active}
                  live={live}
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
