import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
  placeholder?: string
  error?: string
}

export default function Select({
  label,
  options,
  placeholder = 'Seçiniz',
  error,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.replace(/\s/g, '-').toLowerCase()

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`
          w-full px-3 py-2 rounded-lg border border-neutral-300
          bg-white text-neutral-900 text-sm
          focus:outline-none focus:border-myrank-blue
          ${error ? 'border-myrank-red' : ''}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-myrank-red">{error}</p>}
    </div>
  )
}
