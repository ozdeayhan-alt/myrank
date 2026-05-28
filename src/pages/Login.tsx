import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AppContext'

export default function Login() {
  const {
    isAuthenticated,
    isOnboarded,
    authLoading,
    loginWithGoogle,
  } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Kontrol ediliyor...</p>
      </div>
    )
  }

  if (isAuthenticated && isOnboarded) {
    return <Navigate to="/feed" replace />
  }

  if (isAuthenticated && !isOnboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <section className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-5 shadow-none">
        <h1 className="text-lg font-bold text-neutral-900 text-center">
          MyRank
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-5">
          Devam etmek icin kimligini dogrula.
        </p>

        <button
          type="button"
          onClick={async () => {
            setError('')
            setLoading(true)
            try {
              await loginWithGoogle()
            } catch {
              setError('Google girisi basarisiz oldu. Lutfen tekrar dene.')
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
          className="
            w-full py-3 text-sm font-medium rounded-xl
            bg-white border border-slate-200 text-neutral-800
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          Google ile Devam Et
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>
    </div>
  )
}
