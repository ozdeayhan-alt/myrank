import type { AppPost } from '../types/post'
import { normalizePost } from '../utils/normalizePost'

const RAW = [
  {
    id: 'seed-1',
    userId: 'system',
    author: 'myrank_resmi',
    type: 'photo' as const,
    content:
      'MyRank test gönderisi. Beğen veya beğenme ile kombo yap; ' +
      '33 tıkta tam puan, yarıda kalırsa tek puan yazılır.',
    mediaUrl:
      'https://images.unsplash.com/photo-1611162617474-5b21e939e113?w=800&q=80',
    createdAt: '2026-05-27T10:00:00Z',
  },
]

export const INITIAL_POSTS: AppPost[] = RAW.map((p) => normalizePost(p))
