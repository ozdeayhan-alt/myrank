import type { ReactNode } from 'react'

interface PageShellProps {
  children?: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="px-4 py-4">
      {children ?? (
        <p className="text-sm text-neutral-500">
          Bu sayfa iskelet aşamasında.
        </p>
      )}
    </div>
  )
}
