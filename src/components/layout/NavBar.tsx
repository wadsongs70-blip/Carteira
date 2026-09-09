import { NavLink } from 'react-router-dom'
import { Home, ArrowLeftRight, Target, BarChart3, User, Plus } from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'
import { QuickAddModal } from '@/components/feedback/QuickAddModal'

const items = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/analise', label: 'Análise', icon: BarChart3 },
  { to: '/perfil', label: 'Perfil', icon: User },
]

export function NavBar() {
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 sm:static sm:w-64 sm:h-screen border-t sm:border-t-0 sm:border-r border-black/5 dark:border-white/10 bg-card-light dark:bg-card-dark z-40">
        <div className="hidden sm:block px-6 py-6">
          <h1 className="text-xl font-semibold tracking-tight">Fortuna</h1>
          <p className="text-xs text-muted mt-1">Seu painel de evolução financeira</p>
        </div>

        <ul className="flex sm:flex-col justify-around sm:justify-start sm:gap-1 sm:px-3">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1 sm:flex-none">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex sm:flex-row flex-col items-center gap-0.5 sm:gap-3 py-2.5 sm:px-4 sm:py-2.5 sm:rounded-full text-xs sm:text-sm transition',
                    isActive
                      ? 'text-accent sm:bg-accent-soft dark:sm:bg-accent/20 font-medium'
                      : 'text-muted hover:text-neutral-700 dark:hover:text-neutral-200'
                  )
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setQuickAddOpen(true)}
          className="hidden sm:flex items-center gap-2 mx-6 mt-6 btn-primary"
        >
          <Plus size={16} /> Adicionar
        </button>

        <button
          onClick={() => setQuickAddOpen(true)}
          className="sm:hidden fixed bottom-16 right-4 bg-accent text-white rounded-full p-4 shadow-lg"
          aria-label="Adicionar"
        >
          <Plus size={22} />
        </button>
      </nav>

      <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </>
  )
}
