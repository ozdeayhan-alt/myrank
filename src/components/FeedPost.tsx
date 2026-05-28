import type { AppPost } from '../types/post'
import { useApp } from '../context/AppContext'
import { usePostFullscreen } from '../hooks/usePostFullscreen'
import { getAvatarUrl } from '../utils/avatar'
import PostScoreBadge from './PostScoreBadge'
import VideoPreview from './feed/VideoPreview'
import ComboVotePanel from './feed/ComboVotePanel'

interface FeedPostProps {
  post: AppPost
}

export default function FeedPost({ post: postProp }: FeedPostProps) {
  const { getPost } = useApp()
  const post = getPost(postProp.id) ?? postProp
  const openFullScreen = usePostFullscreen(post)

  return (
    <article className="relative border border-[#e2e8f0] rounded-xl overflow-hidden bg-white mb-4">
      <PostScoreBadge postId={post.id} />

      <button
        type="button"
        onClick={openFullScreen}
        className="w-full text-left"
      >
        <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2 pr-16">
          <img
            src={getAvatarUrl(post.author)}
            alt=""
            className="w-8 h-8 rounded-full border border-[#e2e8f0]"
          />
          <span className="text-sm font-medium text-neutral-900">
            @{post.author}
          </span>
          <span className="ml-auto text-[10px] uppercase text-gray-400">
            {post.type}
          </span>
        </div>

        {post.type === 'tweet' && (
          <div className="px-3 py-4">
            <p className="text-sm text-neutral-800 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {post.type === 'video' && (
          <div className="px-3 pt-3 pb-1">
            <div
              className="
                relative mx-auto max-w-[240px]
                aspect-[9/16] rounded-xl overflow-hidden
                border border-[#e2e8f0] bg-neutral-100
              "
            >
              <VideoPreview post={post} />
              <span
                className="
                  absolute bottom-2 right-2
                  px-1.5 py-0.5 rounded text-[9px] font-bold
                  bg-red-600 text-white
                "
              >
                33s
              </span>
            </div>
            {post.content && (
              <p className="text-sm text-neutral-800 mt-3 px-0">
                {post.content}
              </p>
            )}
          </div>
        )}

        {post.type === 'photo' && post.mediaUrl && (
          <>
            <img
              src={post.mediaUrl}
              alt=""
              className="w-full aspect-square object-cover bg-neutral-100"
            />
            {post.content && (
              <p className="px-3 py-3 text-sm text-neutral-800">
                {post.content}
              </p>
            )}
          </>
        )}
      </button>

      <ComboVotePanel postId={post.id} layout="inline" />
    </article>
  )
}
