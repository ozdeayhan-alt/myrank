import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AppContext'

export default function ProtectedRoute() {
  const { isAuthenticated, isOnboarded, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Yukleniyor...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
