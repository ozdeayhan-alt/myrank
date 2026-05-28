import type { ProfileCategoryRank } from '../../types/profile'
import ProfileCategoryChip from './ProfileCategoryChip'

interface ProfileCategoryStripProps {
  categories: ProfileCategoryRank[]
}

export default function ProfileCategoryStrip({
  categories,
}: ProfileCategoryStripProps) {
  return (
    <section
      aria-label="Kategori sıralamaları"
      className="px-4 pb-4 bg-white"
    >
      <div
        className="
          flex overflow-x-auto gap-x-3 pb-2
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {categories.map((item) => (
          <ProfileCategoryChip key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}
