import { useRef } from 'react'
import { db } from '@/database/db'
import { DEFAULT_USER_ID } from '@/database/schemas/seed'
import { Card } from '@/components/ui/Card'
import { useAppStore } from '@/store/appStore'
import { Moon, Sun, Download, Upload } from 'lucide-react'

export function Settings() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleExport() {
    const data = {
      accounts: await db.accounts.where({ userId: DEFAULT_USER_ID }).toArray(),
      transactions: await db.transactions.where({ userId: DEFAULT_USER_ID }).toArray(),
      categories: await db.categories.where({ userId: DEFAULT_USER_ID }).toArray(),
      budgets: await db.budgets.where({ userId: DEFAULT_USER_ID }).toArray(),
      goals: await db.goals.where({ userId: DEFAULT_USER_ID }).toArray(),
      cards: await db.cards.where({ userId: DEFAULT_USER_ID }).toArray(),
      recurringTransactions: await db.recurringTransactions.where({ userId: DEFAULT_USER_ID }).toArray(),
      settings: await db.settings.where({ userId: DEFAULT_USER_ID }).toArray(),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fortuna-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const data = JSON.parse(text)

    await db.transaction(
      'rw',
      [db.accounts, db.transactions, db.categories, db.budgets, db.goals, db.cards, db.recurringTransactions],
      async () => {
        if (data.accounts) await db.accounts.bulkPut(data.accounts)
        if (data.transactions) await db.transactions.bulkPut(data.transactions)
        if (data.categories) await db.categories.bulkPut(data.categories)
        if (data.budgets) await db.budgets.bulkPut(data.budgets)
        if (data.goals) await db.goals.bulkPut(data.goals)
        if (data.cards) await db.cards.bulkPut(data.cards)
        if (data.recurringTransactions) await db.recurringTransactions.bulkPut(data.recurringTransactions)
      }
    )
    alert('Dados importados com sucesso.')
  }

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Aparência</p>
            <p className="text-xs text-muted">Alternar entre modo claro e escuro</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-black/5 dark:bg-white/10"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </Card>

      <Card>
        <p className="font-medium mb-1">Seus dados são só seus</p>
        <p className="text-xs text-muted mb-4">
          O Fortuna funciona 100% local, sem servidor. Faça backup regularmente para não perder seu histórico.
        </p>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Download size={14} /> Exportar dados (JSON)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center gap-1.5 text-xs"
          >
            <Upload size={14} /> Importar dados
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleImport} />
        </div>
      </Card>
    </div>
  )
}
