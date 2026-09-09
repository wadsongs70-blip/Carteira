import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NavBar } from '@/components/layout/NavBar'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { Transactions } from '@/pages/Transactions/Transactions'
import { Goals } from '@/pages/Goals/Goals'
import { Analytics } from '@/pages/Analytics/Analytics'
import { Settings } from '@/pages/Settings/Settings'
import { useAppStore } from '@/store/appStore'
import { ensureSeedData } from '@/database/schemas/seed'

export default function App() {
  const init = useAppStore((s) => s.init)
  const loaded = useAppStore((s) => s.loaded)

  useEffect(() => {
    ensureSeedData().then(init)
  }, [init])

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center text-muted">Carregando…</div>
  }

  return (
    <BrowserRouter>
      <div className="sm:flex min-h-screen">
        <NavBar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movimentacoes" element={<Transactions />} />
            <Route path="/metas" element={<Goals />} />
            <Route path="/analise" element={<Analytics />} />
            <Route path="/perfil" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
