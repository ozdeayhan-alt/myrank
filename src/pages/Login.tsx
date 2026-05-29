import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const {
    isAuthenticated,
    isOnboarded,
    authLoading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
  } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'google' | 'email'>('google')

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

        {/* Email/Password Form */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full px-3 py-3 text-sm border border-slate-200 rounded-xl
              bg-white placeholder-gray-400 text-neutral-800
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-3 py-3 text-sm border border-slate-200 rounded-xl
              bg-white placeholder-gray-400 text-neutral-800
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        </div>

        {/* Email/Password Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={async () => {
              setError('')
              setLoading(true)
              try {
                await loginWithEmail(email, password)
              } catch (err: unknown) {
                const errorMsg = err instanceof Error ? err.message : 'Giriş başarısız oldu'
                if (errorMsg.includes('user-not-found')) {
                  setError('Bu e-posta ile kayıt bulunamadı.')
                } else if (errorMsg.includes('wrong-password')) {
                  setError('Şifre yanlış.')
                } else if (errorMsg.includes('invalid-email')) {
                  setError('E-posta geçersiz.')
                } else {
                  setError(errorMsg || 'Giriş başarısız oldu. Lütfen tekrar dene.')
                }
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading || !email || !password}
            className="
              py-3 text-sm font-medium rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors
            "
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={async () => {
              setError('')
              setLoading(true)
              try {
                await registerWithEmail(email, password)
              } catch (err: unknown) {
                const errorMsg = err instanceof Error ? err.message : 'Kayıt başarısız oldu'
                if (errorMsg.includes('email-already-in-use')) {
                  setError('Bu e-posta zaten kayıtlı.')
                } else if (errorMsg.includes('weak-password')) {
                  setError('Şifre çok zayıf.')
                } else if (errorMsg.includes('invalid-email')) {
                  setError('E-posta geçersiz.')
                } else {
                  setError(errorMsg || 'Kayıt başarısız oldu. Lütfen tekrar dene.')
                }
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading || !email || !password}
            className="
              py-3 text-sm font-medium rounded-xl
              bg-green-600 text-white
              hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors
            "
          >
            Kayıt Ol
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mt-5 mb-5">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-3 text-xs text-gray-500">VEYA</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={async () => {
            setError('')
            setLoading(true)
            try {
              await loginWithGoogle()
            } catch (err: unknown) {
              const errorMsg = err instanceof Error ? err.message : 'Google girişi başarısız oldu'
              setError(errorMsg || 'Google girişi başarısız oldu. Lütfen tekrar dene.')
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
          className="
            w-full py-3 text-sm font-medium rounded-xl
            bg-white border border-slate-200 text-neutral-800
            hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed
            transition-colors
          "
        >
          Google ile Devam Et
        </button>

        {/* Error Message */}
        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
      </section>
    </div>
  )
}
