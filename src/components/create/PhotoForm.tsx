interface PhotoFormProps {
  caption: string
  previewUrl: string | null
  onCaptionChange: (value: string) => void
  onFileSelect: (file: File | null) => void
}

export default function PhotoForm({
  caption,
  previewUrl,
  onCaptionChange,
  onFileSelect,
}: PhotoFormProps) {
  return (
    <div className="space-y-4">
      <div
        className="
          w-full aspect-square max-w-sm mx-auto
          bg-neutral-100 border border-[#e2e8f0]
          rounded-xl overflow-hidden
        "
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="
                absolute bottom-2 right-2
                px-2 py-1 text-xs bg-white
                border border-[#e2e8f0] rounded-md
              "
            >
              Değiştir
            </button>
          </div>
        ) : (
          <label
            className="
              flex flex-col items-center justify-center
              w-full h-full cursor-pointer
              text-gray-500 text-sm
            "
          >
            <span className="text-2xl mb-1">+</span>
            <span>Fotoğraf seç</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                onFileSelect(file)
              }}
            />
          </label>
        )}
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3">
        <label className="text-xs text-gray-500 mb-1 block">
          Açıklama
        </label>
        <textarea
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Fotoğrafına bir açıklama yaz..."
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
