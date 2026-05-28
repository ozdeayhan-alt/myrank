import { useMemo, useState } from 'react'

interface VideoFormProps {
  caption: string
  previewUrl: string | null
  onCaptionChange: (value: string) => void
  onFileSelect: (file: File | null) => void
  durationError: string
}

type PreviewFilterKey = 'normal' | 'grayscale' | 'sepia' | 'contrast'

const PREVIEW_FILTERS: {
  key: PreviewFilterKey
  label: string
  cssFilter: string
}[] = [
  { key: 'normal', label: 'Normal', cssFilter: 'none' },
  { key: 'grayscale', label: 'Siyah Beyaz', cssFilter: 'grayscale(100%)' },
  { key: 'sepia', label: 'Sepya', cssFilter: 'sepia(85%)' },
  { key: 'contrast', label: 'Kontrast', cssFilter: 'contrast(125%)' },
]

export default function VideoForm({
  caption,
  previewUrl,
  onCaptionChange,
  onFileSelect,
  durationError,
}: VideoFormProps) {
  const [selectedFilter, setSelectedFilter] =
    useState<PreviewFilterKey>('normal')
  const [overlayText, setOverlayText] = useState('')
  const [autoSubtitle, setAutoSubtitle] = useState(false)

  const videoFilter = useMemo(
    () =>
      PREVIEW_FILTERS.find((item) => item.key === selectedFilter)?.cssFilter ??
      'none',
    [selectedFilter],
  )

  return (
    <div className="space-y-4">
      <div
        className="
          relative mx-auto w-full max-w-[220px]
          aspect-[9/16] bg-neutral-100
          border border-slate-200 rounded-xl shadow-none
          overflow-hidden
        "
      >
        <span
          className="
            absolute top-2 left-2 z-10
            px-2 py-0.5 rounded-md
            bg-red-600 text-white text-xs font-bold
          "
        >
          MAX 33 SN
        </span>
        {previewUrl ? (
          <>
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              style={{ filter: videoFilter }}
              controls
            />
            {overlayText.trim() && (
              <div
                className="
                  absolute left-2 right-2 bottom-12 z-10
                  px-2 py-1 text-xs text-white text-center font-medium
                  bg-black/60 rounded-md
                "
              >
                {overlayText}
              </div>
            )}
          </>
        ) : (
          <label
            className="
              flex flex-col items-center justify-center
              w-full h-full cursor-pointer
              text-gray-500 text-sm
            "
          >
            <span className="text-2xl mb-1">+</span>
            <span>Video seç</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                onFileSelect(file)
              }}
            />
          </label>
        )}
        {previewUrl && (
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="
                px-2 py-1 text-xs bg-white rounded-md
                border border-slate-200 shadow-none
              "
            >
              Kaldır
            </button>
            <label
              className="
                px-2 py-1 text-xs bg-white rounded-md
                border border-slate-200 shadow-none cursor-pointer
              "
            >
              Değiştir
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  onFileSelect(file)
                }}
              />
            </label>
          </div>
        )}
      </div>

      {durationError && (
        <p
          className="
            text-sm text-red-600 bg-white border border-slate-200
            rounded-xl p-3 shadow-none
          "
        >
          {durationError}
        </p>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-none">
        <p className="text-xs text-gray-500 mb-2">Gorsel Filtreler</p>
        <div className="flex flex-wrap gap-1.5">
          {PREVIEW_FILTERS.map((item) => {
            const active = item.key === selectedFilter
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedFilter(item.key)}
                className={`
                  px-2.5 py-1 text-xs rounded-lg border bg-white
                  ${active
                    ? 'border-blue-600 text-blue-600'
                    : 'border-slate-200 text-gray-600'
                  }
                `}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-none">
        <label className="text-xs text-gray-500 mb-1 block">
          Metin Ekle
        </label>
        <input
          type="text"
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
          placeholder="Videonun uzerinde gorunecek metin..."
          maxLength={60}
          className="
            w-full px-3 py-2 text-sm rounded-xl
            border border-slate-200 bg-white
            focus:outline-none focus:border-blue-600
          "
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-none">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">
            Otomatik Altyazi
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={autoSubtitle}
            onClick={() => setAutoSubtitle((v) => !v)}
            className={`
              relative w-11 h-6 rounded-full border transition-colors
              ${autoSubtitle
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-slate-200'
              }
            `}
          >
            <span
              className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white
                transition-all
                ${autoSubtitle ? 'left-6' : 'left-1'}
              `}
            />
          </button>
        </div>
        {autoSubtitle && (
          <p
            className="
              mt-3 px-2 py-1.5 text-xs text-white bg-black
              rounded-md text-center
            "
          >
            [Simule Altyazi] Bugun ligde hareket var, gozunu siralamadan ayirma.
          </p>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-none">
        <label className="text-xs text-gray-500 mb-1 block">
          Açıklama
        </label>
        <textarea
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Videona kısa bir açıklama ekle..."
          rows={2}
          className="
            w-full resize-none border-none outline-none
            text-sm text-neutral-900 bg-transparent
          "
        />
      </div>
    </div>
  )
}
