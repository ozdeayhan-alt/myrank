import type { AppPost } from '../types/post'
import type { RankingFilterKey } from '../types/ranking'
import { getAuthorMeta, matchesCategoryFilter } from './authorMeta'
import type { RegisterProfile } from '../types'

export interface ExploreFilterState {
  search: string
  filterKey: RankingFilterKey | null
  filterValue: string | null
}

export function filterExplorePosts(
  posts: AppPost[],
  state: ExploreFilterState,
  currentProfile?: RegisterProfile,
): AppPost[] {
  const q = state.search.trim().toLowerCase()

  return posts.filter((post) => {
    const meta = getAuthorMeta(post.author, currentProfile)

    if (state.filterKey && state.filterValue) {
      if (!matchesCategoryFilter(meta, state.filterKey, state.filterValue)) {
        return false
      }
    }

    if (!q) return true

    const inContent = post.content.toLowerCase().includes(q)
    const inAuthor = post.author.toLowerCase().includes(q)
    const inMeta =
      meta &&
      (
        meta.country.toLowerCase().includes(q) ||
        meta.city.toLowerCase().includes(q) ||
        meta.profession.toLowerCase().includes(q) ||
        meta.interests.toLowerCase().includes(q)
      )

    return inContent || inAuthor || !!inMeta
  })
}
