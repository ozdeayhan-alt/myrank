import type { AppPost } from '../../types/post'
import ExploreGridItem from './ExploreGridItem'

interface ExploreGridProps {
  posts: AppPost[]
}

export default function ExploreGrid({ posts }: ExploreGridProps) {
  if (posts.length === 0) {
    return (
      <p className="text-sm text-center text-gray-500 py-12">
        Bu arama veya filtreye uygun içerik bulunamadı.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <ExploreGridItem key={post.id} post={post} />
      ))}
    </div>
  )
}
