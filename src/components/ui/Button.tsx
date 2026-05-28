import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'blue' | 'outline'
  fullWidth?: boolean
  children: ReactNode
}

const variants = {
  red: 'bg-myrank-red text-white',
  blue: 'bg-myrank-blue text-white',
  outline: 'bg-white text-neutral-800 border border-neutral-300',
}

export default function Button({
  variant = 'red',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2.5 text-sm font-medium rounded-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
