import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label.replace(/\s/g, '-').toLowerCase()

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 rounded-lg border border-neutral-300
          bg-white text-neutral-900 text-sm
          focus:outline-none focus:border-myrank-blue
          ${error ? 'border-myrank-red' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-myrank-red">{error}</p>}
    </div>
  )
}
