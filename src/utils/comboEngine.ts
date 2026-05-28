import type { AppPost, ComboDirection } from '../types/post'

export const COMBO_TARGET = 33

function settleIncomplete(
  direction: ComboDirection,
  likes: number,
  dislikes: number,
): { likes: number; dislikes: number; message: string } {
  if (direction === 'like') {
    return {
      likes: likes + 1,
      dislikes,
      message: 'Kombo yarıda kaldı → sunucuya +1 puan yazıldı.',
    }
  }
  if (direction === 'dislike') {
    return {
      likes,
      dislikes: dislikes + 1,
      message: 'Kombo yarıda kaldı → sunucuya -1 puan yazıldı.',
    }
  }
  return { likes, dislikes, message: '' }
}

export function applyVoteToPost(
  post: AppPost,
  type: 'like' | 'dislike',
): AppPost {
  let likes = post.likes
  let dislikes = post.dislikes
  let comboDirection = post.comboDirection
  let comboCount = post.comboCount
  let lastServerAction: string | null = null

  if (
    comboDirection !== null &&
    comboDirection !== type &&
    comboCount > 0
  ) {
    const settled = settleIncomplete(comboDirection, likes, dislikes)
    likes = settled.likes
    dislikes = settled.dislikes
    lastServerAction = settled.message
    comboDirection = null
    comboCount = 0
  }

  if (comboDirection === type) {
    comboCount += 1
  } else {
    comboDirection = type
    comboCount = 1
  }

  if (comboCount >= COMBO_TARGET) {
    if (type === 'like') {
      likes += COMBO_TARGET
      lastServerAction =
        `33 kombo tamamlandı → sunucuya +${COMBO_TARGET} puan yazıldı.`
    } else {
      dislikes += COMBO_TARGET
      lastServerAction =
        `33 kombo tamamlandı → sunucuya -${COMBO_TARGET} puan yazıldı.`
    }
    comboDirection = null
    comboCount = 0
  }

  return {
    ...post,
    likes,
    dislikes,
    comboDirection,
    comboCount,
    lastServerAction: lastServerAction ?? post.lastServerAction,
  }
}
