import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { getFilterOptions } from '../data/rankingUsers'
import type { RankingFilterKey } from '../types/ranking'
import ExploreSearchBar from '../components/explore/ExploreSearchBar'
import ExploreCategoryBar from '../components/explore/ExploreCategoryBar'
import ExploreSubOptions from '../components/explore/ExploreSubOptions'
import ExploreGrid from '../components/explore/ExploreGrid'
import { filterExplorePosts } from '../utils/exploreFilters'

export default function Explore() {
  const { posts, user } = useApp()

  const [search, setSearch] = useState('')
  const [openCategory, setOpenCategory] =
    useState<RankingFilterKey | null>(null)
  const [filterKey, setFilterKey] = useState<RankingFilterKey | null>(null)
  const [filterValue, setFilterValue] = useState<string | null>(null)

  const subOptions = useMemo(() => {
    if (!openCategory) return []
    return getFilterOptions(openCategory)
  }, [openCategory])

  const filtered = useMemo(
    () =>
      filterExplorePosts(
        posts,
        { search, filterKey, filterValue },
        user?.profile,
      ),
    [posts, search, openCategory, filterKey, filterValue, user?.profile],
  )

  const handleCategoryClick = (key: RankingFilterKey) => {
    if (openCategory === key) {
      setOpenCategory(null)
      return
    }
    setOpenCategory(key)
  }

  const handleSubSelect = (value: string) => {
    if (!openCategory) return
    setFilterKey(openCategory)
    setFilterValue(value)
  }

  const handleClearFilter = () => {
    setFilterKey(null)
    setFilterValue(null)
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 pb-6">
      <ExploreSearchBar value={search} onChange={setSearch} />

      <div className="mt-4">
        <ExploreCategoryBar
          openCategory={openCategory}
          activeFilterKey={filterKey}
          onSelectCategory={handleCategoryClick}
        />
      </div>

      {openCategory && subOptions.length > 0 && (
        <div className="mt-3">
          <ExploreSubOptions
            category={openCategory}
            options={subOptions}
            selectedValue={
              filterKey === openCategory ? filterValue : null
            }
            onSelect={handleSubSelect}
            onClear={handleClearFilter}
          />
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">
          {filtered.length} içerik
          {filterValue ? ` · ${filterValue}` : ''}
        </p>
        <ExploreGrid posts={filtered} />
      </div>
    </div>
  )
}
