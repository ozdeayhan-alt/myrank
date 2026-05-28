import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AppContext'

export default function Onboarding() {
  const {
    isAuthenticated,
    isOnboarded,
    authLoading,
    completeOnboarding,
  } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [profession, setProfession] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Kontrol ediliyor...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isOnboarded) {
    return <Navigate to="/feed" replace />
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <main className="max-w-lg mx-auto w-full">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-none">
          <p className="text-xs text-gray-500 mb-2">
            Adim {step} / 3
          </p>

          {step === 1 && (
            <div className="space-y-3">
              <h1 className="text-lg font-bold text-neutral-900">
                Lokasyon Bilgileri
              </h1>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Ulke
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Turkiye"
                  className="
                    w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
                    text-sm focus:outline-none focus:border-blue-600
                  "
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Sehir
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Istanbul"
                  className="
                    w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
                    text-sm focus:outline-none focus:border-blue-600
                  "
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!country.trim() || !city.trim()) {
                    setError('Ulke ve sehir zorunlu.')
                    return
                  }
                  setError('')
                  setStep(2)
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
              >
                Devam Et
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-neutral-900">
                Kisisel Demografi
              </h2>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Yas
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className="
                    w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
                    text-sm focus:outline-none focus:border-blue-600
                  "
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Cinsiyet</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Erkek', 'Kadin', 'Belirtmek Istemiyorum'].map((item) => {
                    const active = gender === item
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setGender(item)}
                        className={`
                          py-2 px-2 text-xs rounded-xl border bg-white shadow-none
                          ${active
                            ? 'border-blue-600 text-blue-600'
                            : 'border-slate-200 text-gray-600'
                          }
                        `}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Medeni Durum</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Evli', 'Bekar'].map((item) => {
                    const active = maritalStatus === item
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMaritalStatus(item)}
                        className={`
                          py-2 px-3 text-sm rounded-xl border bg-white shadow-none
                          ${active
                            ? 'border-blue-600 text-blue-600'
                            : 'border-slate-200 text-gray-600'
                          }
                        `}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!age.trim() || !gender || !maritalStatus) {
                    setError('Yas, cinsiyet ve medeni durum zorunlu.')
                    return
                  }
                  setError('')
                  setStep(3)
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
              >
                Devam Et
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-neutral-900">
                Profesyonel Durum
              </h2>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Meslek
                </label>
                <input
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Muhendis"
                  className="
                    w-full px-3 py-2 rounded-xl border border-slate-200 bg-white
                    text-sm focus:outline-none focus:border-blue-600
                  "
                />
              </div>
              <p className="text-sm text-gray-600">
                Siralamaya en alt ligden basliyorsun.
              </p>
              <button
                type="button"
                disabled={submitting}
                onClick={async () => {
                  if (!profession.trim()) {
                    setError('Meslek zorunlu.')
                    return
                  }
                  setError('')
                  setSubmitting(true)
                  try {
                    await completeOnboarding({
                      country,
                      city,
                      age,
                      gender,
                      maritalStatus,
                      profession,
                    })
                    navigate('/feed', { replace: true })
                  } catch {
                    setError('Kayit tamamlanamadi. Lutfen tekrar dene.')
                  } finally {
                    setSubmitting(false)
                  }
                }}
                className="
                  w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                MyRank'e Katil
              </button>
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>
      </main>
    </div>
  )
}
