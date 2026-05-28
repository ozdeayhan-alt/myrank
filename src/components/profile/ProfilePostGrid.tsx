import type { AppPost } from '../../types/post'
import { usePostFullscreen } from '../../hooks/usePostFullscreen'
import { getPostGridImage } from '../../utils/postMedia'
import VideoPreview from '../feed/VideoPreview'

interface ProfilePostGridProps {
  posts: AppPost[]
}

function GridCell({ post }: { post: AppPost }) {
  const openFullScreen = usePostFullscreen(post)

  return (
    <button
      type="button"
      onClick={openFullScreen}
      className="
        relative aspect-square overflow-hidden
        border border-[#e2e8f0] bg-neutral-100
      "
    >
      {post.type === 'tweet' ? (
        <div className="w-full h-full p-1.5 flex items-center justify-center bg-white">
          <p className="text-[9px] leading-tight text-neutral-700 line-clamp-5 text-center">
            {post.content}
          </p>
        </div>
      ) : post.type === 'video' ? (
        <>
          <VideoPreview post={post} />
          <span
            className="
              absolute bottom-1 right-1 z-10
              px-1 py-0.5 rounded text-[9px] font-bold
              bg-red-600 text-white
            "
          >
            33s
          </span>
        </>
      ) : (
        <img
          src={getPostGridImage(post)}
          alt=""
          className="w-full h-full object-cover"
        />
      )}
    </button>
  )
}

export default function ProfilePostGrid({ posts }: ProfilePostGridProps) {
  return (
    <section
      aria-label="Gönderiler"
      className="grid grid-cols-3 gap-1 bg-white"
    >
      {posts.map((post) => (
        <GridCell key={post.id} post={post} />
      ))}
    </section>
  )
}
