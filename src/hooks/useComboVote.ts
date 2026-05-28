import { useApp } from '../context/AppContext'
import { getPostScore } from '../types/post'
import { COMBO_TARGET } from '../utils/comboEngine'

export function useComboVote(postId: string) {
  const { getPost, voteOnPost } = useApp()
  const post = getPost(postId)

  return {
    likes: post?.likes ?? 0,
    dislikes: post?.dislikes ?? 0,
    score: post ? getPostScore(post) : 0,
    comboDirection: post?.comboDirection ?? null,
    comboCount: post?.comboCount ?? 0,
    comboTarget: COMBO_TARGET,
    lastServerAction: post?.lastServerAction ?? null,
    voteLike: () => voteOnPost(postId, 'like'),
    voteDislike: () => voteOnPost(postId, 'dislike'),
  }
}
