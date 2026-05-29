import PageShell from '../components/PageShell'
import FeedPost from '../components/FeedPost'
import { useApp } from '../context/AppContext'

export default function Home() {
  const { feedPosts } = useApp()

  return (
    <PageShell>
      {feedPosts.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Henüz gönderi yok. + ile paylaşın.
        </p>
      ) : (
        feedPosts.map((post) => (
          <FeedPost
            key={`${post.id}-${post.mediaUrl ?? 'empty'}`}
            post={post}
          />
        ))
      )}
      <p className="text-xs text-neutral-400 mt-4">
        Gönderi Puanı = Beğeni − Beğenmeme
      </p>
    </PageShell>
  )
}
