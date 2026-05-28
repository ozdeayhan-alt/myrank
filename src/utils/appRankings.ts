import { RANKING_USERS } from '../data/rankingUsers'
import type { AuthUser, RegisterProfile } from '../types'
import type { AppPost } from '../types/post'
import { getPostScore } from '../types/post'
import type { RankedUser } from '../types/ranking'
import {
  RANKING_FILTER_LABELS,
  type RankingFilterKey,
} from '../types/ranking'
import type { ProfileCategoryRank } from '../types/profile'

export function sumAuthorPostScores(
  posts: AppPost[],
  username: string,
  userId: string,
): number | null {
  const authorPosts = posts.filter(
    (p) => p.author === username || p.userId === userId,
  )
  if (authorPosts.length === 0) return null
  return authorPosts.reduce((sum, p) => sum + getPostScore(p), 0)
}

function profileToRankedUser(
  user: AuthUser,
  totalPoints: number,
): RankedUser {
  const { profile } = user
  return {
    id: user.id,
    username: profile.username,
    country: profile.country,
    city: profile.city,
    gender: profile.gender,
    age: profile.age,
    profession: profile.profession,
    maritalStatus: profile.maritalStatus,
    interests: profile.interests,
    totalPoints,
  }
}

export function buildDynamicRankings(
  posts: AppPost[],
  currentUser: AuthUser | null,
): RankedUser[] {
  const board: RankedUser[] = RANKING_USERS.map((u) => {
    const fromPosts = sumAuthorPostScores(posts, u.username, u.id)
    return {
      ...u,
      totalPoints: fromPosts ?? u.totalPoints,
    }
  })

  if (currentUser) {
    const pts =
      sumAuthorPostScores(
        posts,
        currentUser.username,
        currentUser.id,
      ) ?? 0
    const idx = board.findIndex(
      (u) =>
        u.username === currentUser.username ||
        u.id === currentUser.id,
    )
    if (idx >= 0) {
      board[idx] = {
        ...profileToRankedUser(currentUser, pts),
        totalPoints: pts > 0 || sumAuthorPostScores(posts, currentUser.username, currentUser.id) !== null
          ? pts
          : board[idx].totalPoints,
      }
    } else {
      board.push(profileToRankedUser(currentUser, pts))
    }
  }

  return [...board].sort((a, b) => b.totalPoints - a.totalPoints)
}

export function getWorldRankFromBoard(
  board: RankedUser[],
  username: string,
): number {
  const idx = board.findIndex((u) => u.username === username)
  return idx >= 0 ? idx + 1 : board.length + 1
}

export function getRankInCategoryFromBoard(
  board: RankedUser[],
  category: RankingFilterKey,
  value: string,
  username: string,
): number {
  const pool = board.filter((u) => {
    if (category === 'interests') {
      return u.interests.toLowerCase().includes(value.toLowerCase())
    }
    return u[category] === value
  })
  const idx = pool.findIndex((u) => u.username === username)
  return idx >= 0 ? idx + 1 : pool.length + 1
}

export function buildCategoryRanksFromBoard(
  profile: RegisterProfile,
  username: string,
  board: RankedUser[],
): ProfileCategoryRank[] {
  const keys: RankingFilterKey[] = [
    'country',
    'city',
    'gender',
    'age',
    'profession',
    'maritalStatus',
    'interests',
  ]

  const categories = keys.map((key) => ({
    key,
    label: RANKING_FILTER_LABELS[key],
    rank: getRankInCategoryFromBoard(board, key, profile[key], username),
  }))

  return [
    {
      key: 'world',
      label: 'Dünya',
      rank: getWorldRankFromBoard(board, username),
    },
    ...categories,
  ]
}

export function getUserTotalPointsFromBoard(
  board: RankedUser[],
  username: string,
): number {
  const u = board.find((x) => x.username === username)
  return u?.totalPoints ?? 0
}
