const MAX_CHARS = 280

interface TweetFormProps {
  avatarUrl: string
  text: string
  onTextChange: (value: string) => void
}

export default function TweetForm({
  avatarUrl,
  text,
  onTextChange,
}: TweetFormProps) {
  const remaining = MAX_CHARS - text.length

  return (
    <div
      className="
        bg-white border border-[#e2e8f0] rounded-xl p-4
      "
    >
      <div className="flex gap-3">
        <img
          src={avatarUrl}
          alt=""
          className="
            w-10 h-10 rounded-full shrink-0
            border border-[#e2e8f0] object-cover
          "
        />
        <textarea
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              onTextChange(e.target.value)
            }
          }}
          placeholder="Ne düşünüyorsun?"
          rows={5}
          className="
            flex-1 resize-none border-none outline-none
            text-sm text-neutral-900 bg-transparent
            placeholder:text-gray-400 leading-relaxed
          "
        />
      </div>
      <div className="flex justify-end mt-2 pt-2 border-t border-slate-100">
        <span
          className={`
            text-xs tabular-nums
            ${remaining < 20 ? 'text-red-600' : 'text-gray-500'}
          `}
        >
          {text.length} / {MAX_CHARS}
        </span>
      </div>
    </div>
  )
}
