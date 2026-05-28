import { NavLink, useLocation } from 'react-router-dom'
import { Home, Compass, Plus, Trophy, User } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()

  const isActive = (to: string, end?: boolean) => {
    if (end) return location.pathname === '/feed'
    return location.pathname.startsWith(to)
  }

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        h-14 bg-white border-t border-[#e2e8f0]
      "
    >
      <div className="relative flex items-center h-full max-w-lg mx-auto">
        <NavLink
          to="/feed"
          end
          aria-label="Ana Sayfa"
          className="flex-1 flex items-center justify-center h-full"
        >
          <Home
            size={22}
            strokeWidth={1}
            className={
              isActive('/', true)
                ? 'text-blue-500'
                : 'text-gray-400'
            }
          />
        </NavLink>

        <NavLink
          to="/explore"
          aria-label="Keşfet"
          className="flex-1 flex items-center justify-center h-full"
        >
          <Compass
            size={22}
            strokeWidth={1}
            className={
              isActive('/explore')
                ? 'text-blue-500'
                : 'text-gray-400'
            }
          />
        </NavLink>

        <div className="flex-1 flex items-center justify-center h-full">
          <NavLink
            to="/create"
            aria-label="Gönderi Paylaş"
            className="
              absolute -top-[18px] left-1/2 -translate-x-1/2
              flex items-center justify-center
              w-[52px] h-[52px] rounded-full
              bg-red-500 text-white
            "
          >
            <Plus size={26} strokeWidth={1} />
          </NavLink>
        </div>

        <NavLink
          to="/rankings"
          aria-label="Sıralama"
          className="flex-1 flex items-center justify-center h-full"
        >
          <Trophy
            size={22}
            strokeWidth={1}
            className={
              isActive('/rankings')
                ? 'text-blue-500'
                : 'text-gray-400'
            }
          />
        </NavLink>

        <NavLink
          to="/profile"
          aria-label="Profil"
          className="flex-1 flex items-center justify-center h-full"
        >
          <User
            size={22}
            strokeWidth={1}
            className={
              isActive('/profile')
                ? 'text-blue-500'
                : 'text-gray-400'
            }
          />
        </NavLink>
      </div>
    </nav>
  )
}
