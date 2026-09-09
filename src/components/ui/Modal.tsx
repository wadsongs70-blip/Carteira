import type { PropsWithChildren } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
}

export function Modal({ open, onClose, title, children }: PropsWithChildren<ModalProps>) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="card w-full sm:max-w-md m-0 sm:m-4 rounded-b-none sm:rounded-xl2">
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button onClick={onClose} aria-label="Fechar" className="ml-auto p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
