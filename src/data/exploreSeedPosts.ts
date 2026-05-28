import type { AppPost } from '../types/post'
import { normalizePost } from '../utils/normalizePost'
import { RANKING_USERS } from './rankingUsers'

const IMAGES = [
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
]

type RawPost = Parameters<typeof normalizePost>[0]

function buildExploreSeeds(): AppPost[] {
  const posts: RawPost[] = []
  const types: AppPost['type'][] = ['photo', 'video', 'tweet']

  RANKING_USERS.forEach((user, index) => {
    const type = types[index % 3]
    const base = {
      userId: user.id,
      author: user.username,
      createdAt: new Date(2026, 4, 20 - index).toISOString(),
    }

    if (type === 'tweet') {
      posts.push({
        ...base,
        id: `explore-${user.id}-tweet`,
        type: 'tweet',
        content: `${user.city} · ${user.interests} hakkında kısa bir düşünce.`,
      })
    } else if (type === 'video') {
      posts.push({
        ...base,
        id: `explore-${user.id}-video`,
        type: 'video',
        content: `${user.country} — 33 sn video`,
        mediaUrl: IMAGES[index % IMAGES.length],
      })
    } else {
      posts.push({
        ...base,
        id: `explore-${user.id}-photo`,
        type: 'photo',
        content: `${user.profession} · ${user.city}`,
        mediaUrl: IMAGES[(index + 1) % IMAGES.length],
      })
    }
  })

  return posts.map((p) => normalizePost(p))
}

export const EXPLORE_SEED_POSTS = buildExploreSeeds()
