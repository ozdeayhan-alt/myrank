import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import FullScreenFeed from '../feed/FullScreenFeed'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 pb-[72px]">
      <main className="max-w-lg mx-auto w-full min-h-screen">
        <Outlet />
      </main>
      <BottomNav />
      <FullScreenFeed />
    </div>
  )
}
