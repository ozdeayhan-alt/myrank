import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProfileHeader from '../components/profile/ProfileHeader'
import MyLeaguesPanel from '../components/profile/MyLeaguesPanel'
import ProfilePostGrid from '../components/profile/ProfilePostGrid'
import { formatDisplayName, getAvatarUrl } from '../utils/avatar'
import { computeMyLeagues } from '../utils/myLeagues'

export default function Profile() {
  const navigate = useNavigate()
  const {
    user,
    logout,
    getPostsByUser,
    rankings,
    getWorldRank,
    getUserTotalPoints,
  } = useApp()

  const worldRank = useMemo(() => getWorldRank(), [getWorldRank])

  const myLeagues = useMemo(() => {
    if (!user) return []
    return computeMyLeagues(rankings, user.profile, user.username)
  }, [rankings, user])

  const userPosts = useMemo(() => {
    if (!user) return []
    return getPostsByUser(user.id)
  }, [user, getPostsByUser])

  if (!user) return null

  const totalPoints = getUserTotalPoints()

  return (
    <div className="min-h-full bg-white">
      <ProfileHeader
        displayName={formatDisplayName(user.username)}
        avatarUrl={getAvatarUrl(user.username)}
        worldRank={worldRank}
        totalPoints={totalPoints}
      />

      <section className="px-4 pb-4 bg-white">
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate('/notifications')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/notifications')
            }
          }}
          className="
            bg-white rounded-xl border border-slate-200 shadow-none p-4
            flex items-center justify-between cursor-pointer
          "
        >
          <p className="text-sm font-medium text-neutral-800">
            Sen yokken neler oldu?
          </p>
          <button
            type="button"
            aria-label="Dedikoducu sesiyle dinle"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/notifications?speak=true')
            }}
            className="
              shrink-0 w-9 h-9 rounded-lg border border-slate-200
              bg-white flex items-center justify-center text-blue-600
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-5 h-5"
              aria-hidden
            >
              <path d="M4 10h4l5-4v12l-5-4H4z" />
              <path d="M16 9a4 4 0 010 6" />
              <path d="M18.5 6.5a7 7 0 010 11" />
            </svg>
          </button>
        </div>
      </section>

      <MyLeaguesPanel leagues={myLeagues} />

      {userPosts.length > 0 ? (
        <ProfilePostGrid posts={userPosts} />
      ) : (
        <p className="px-4 py-8 text-sm text-center text-gray-500">
          Henüz paylaşım yok.
        </p>
      )}

      <div className="px-4 py-6 bg-white">
        <button
          type="button"
          onClick={logout}
          className="
            w-full py-2.5 text-sm font-medium
            text-red-500 border border-[#e2e8f0]
            rounded-xl bg-white
          "
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}
