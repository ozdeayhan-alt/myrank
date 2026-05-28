import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

type NotificationItem =
  | {
      id: string
      type: 'rank-pass'
      actor: string
      league: string
      time: string
      tone: 'red' | 'blue'
    }
  | {
      id: string
      type: 'like'
      actor: string
      count: number
      postLabel: string
      time: string
      tone: 'red' | 'blue'
    }

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'rank-pass',
    actor: 'zeynep_kaya',
    league: 'Şehir',
    time: 'Az önce',
    tone: 'red',
  },
  {
    id: 'n2',
    type: 'like',
    actor: 'burak_koc',
    count: 33,
    postLabel: 'videona',
    time: '5 dk önce',
    tone: 'blue',
  },
  {
    id: 'n3',
    type: 'rank-pass',
    actor: 'elif_ozturk',
    league: 'Meslek',
    time: '14 dk önce',
    tone: 'red',
  },
  {
    id: 'n4',
    type: 'like',
    actor: 'can_arslan',
    count: 12,
    postLabel: 'gonderine',
    time: '31 dk önce',
    tone: 'blue',
  },
]

function getCardStripeClass(tone: 'red' | 'blue'): string {
  return tone === 'red' ? 'bg-red-500' : 'bg-blue-600'
}

function toPlainText(item: NotificationItem): string {
  if (item.type === 'rank-pass') {
    return `${item.actor} seni ${item.league} liginde gecti.`
  }
  return `${item.actor} senin ${item.postLabel} ${item.count} begeni birakti.`
}

function toGossipVoice(item: NotificationItem): string {
  if (item.type === 'rank-pass') {
    return `Kiz duyduk duymadik deme! O kendini bir sey sanan ${item.actor} var ya, seni ${item.league} liginde cat diye gecmis!`
  }
  return `Ay dur bir de iyi haber vereyim, ${item.actor} senin ${item.postLabel} tam ${item.count} begeni kondurmus!`
}

function toUiMessage(item: NotificationItem): string {
  if (item.type === 'rank-pass') {
    return `${item.actor}, ${item.league} liginde seni gecti.`
  }
  return `${item.actor}, ${item.postLabel} ${item.count} begeni birakti.`
}

export default function Notifications() {
  const location = useLocation()

  const shouldSpeak = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('speak') === 'true'
  }, [location.search])

  useEffect(() => {
    if (!shouldSpeak || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    const synth = window.speechSynthesis
    if (synth.pending || synth.speaking) {
      synth.cancel()
    }

    const speakAll = () => {
      const voices = synth.getVoices()
      let selectedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('tr')) ?? null

      if (!selectedVoice) {
        selectedVoice = voices[0] ?? null
      }

      const lines = NOTIFICATIONS.map(toGossipVoice).join(' ')
      const utter = new SpeechSynthesisUtterance(lines)
      utter.lang = 'tr-TR'
      utter.rate = 1.02
      utter.pitch = 1.1
      if (selectedVoice) {
        utter.voice = selectedVoice
      }

      try {
        synth.speak(utter)
      } catch (error) {
        console.error('Ses motoru baslatilamadi:', error)
      }
    }

    speakAll()
    synth.onvoiceschanged = speakAll

    return () => {
      synth.onvoiceschanged = null
      synth.cancel()
    }
  }, [shouldSpeak])

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 pb-6">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">
        Bildirimler
      </h1>
      <p className="text-xs text-gray-500 mb-4">
        Sen yokken olanlar, kronolojik akista.
      </p>

      <section className="space-y-2.5">
        {NOTIFICATIONS.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-none p-3 flex gap-3"
          >
            <div
              className={`w-1 rounded-full ${getCardStripeClass(item.tone)}`}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-sm text-neutral-800">
                {toUiMessage(item)}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                {item.time}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                {toPlainText(item)}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
