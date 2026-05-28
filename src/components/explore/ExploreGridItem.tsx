import type { AppPost } from '../../types/post'
import { useApp } from '../../context/AppContext'
import { usePostFullscreen } from '../../hooks/usePostFullscreen'
import { getPostGridImage } from '../../utils/postMedia'
import PostScoreBadge from '../PostScoreBadge'
import VideoPreview from '../feed/VideoPreview'

interface ExploreGridItemProps {
  post: AppPost
}

export default function ExploreGridItem({ post: postProp }: ExploreGridItemProps) {
  const { getPost } = useApp()
  const post = getPost(postProp.id) ?? postProp
  const openFullScreen = usePostFullscreen(post)

  return (
    <button
      type="button"
      onClick={openFullScreen}
      className="
        relative aspect-square overflow-hidden
        border border-slate-200 bg-neutral-100
        text-left w-full
      "
    >
      <PostScoreBadge postId={post.id} />

      {post.type === 'tweet' ? (
        <div className="w-full h-full p-2 flex items-center justify-center bg-white">
          <p className="text-[10px] leading-tight text-neutral-700 line-clamp-6 text-center pt-4">
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
