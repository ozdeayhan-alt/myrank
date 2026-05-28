import type { AppPost } from '../../types/post'
import { getAvatarUrl } from '../../utils/avatar'
import { getPostGridImage } from '../../utils/postMedia'
import PostScoreBadge from '../PostScoreBadge'
import VideoPreview from './VideoPreview'
import ComboVotePanel from './ComboVotePanel'

interface FullScreenPostSlideProps {
  post: AppPost
  active: boolean
  live: boolean
}

export default function FullScreenPostSlide({
  post,
  active,
  live,
}: FullScreenPostSlideProps) {
  return (
    <section
      id={`fs-post-${post.id}`}
      className="
        relative h-screen w-full shrink-0
        snap-start snap-always bg-white
        flex flex-col
      "
    >
      <PostScoreBadge postId={post.id} />

      <div className="px-4 pt-12 pb-2 flex items-center gap-2">
        <img
          src={getAvatarUrl(post.author)}
          alt=""
          className="w-8 h-8 rounded-full border border-[#e2e8f0]"
        />
        <span className="text-sm font-medium text-neutral-900">
          @{post.author}
        </span>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {post.type === 'tweet' && (
          <div className="flex-1 flex items-center justify-center px-6">
            <p className="text-base text-neutral-800 text-center whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        )}

        {post.type === 'video' && (
          <div className="flex-1 flex items-center justify-center bg-neutral-100">
            <div className="w-full max-w-sm h-full max-h-[70vh]">
              {live ? (
                <VideoPreview post={post} active={active} />
              ) : (
                <div className="w-full h-full bg-neutral-200" />
              )}
            </div>
          </div>
        )}

        {post.type === 'photo' && post.mediaUrl && (
          <div className="flex-1 flex items-center justify-center bg-neutral-50">
            <img
              src={getPostGridImage(post)}
              alt=""
              className="max-h-full max-w-full w-full object-contain"
            />
          </div>
        )}

        {post.type !== 'tweet' && post.content && (
          <p className="px-4 py-2 text-sm text-neutral-600 text-center">
            {post.content}
          </p>
        )}
      </div>

      <ComboVotePanel postId={post.id} layout="fullscreen" />
    </section>
  )
}
