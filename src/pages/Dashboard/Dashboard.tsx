import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import { DEFAULT_USER_ID } from '@/database/schemas/seed'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CategoryDonutChart, type CategorySlice } from '@/components/charts/CategoryDonutChart'
import { formatCurrency, currentMonthKey } from '@/utils/format'
import { useAppStore } from '@/store/appStore'
import { getLevelProgress } from '@/features/achievements/xp'
import { Flame } from 'lucide-react'

export function Dashboard() {
  const xp = useAppStore((s) => s.xp)
  const streakDays = useAppStore((s) => s.streakDays)
  const { level, progress } = getLevelProgress(xp)

  const monthKey = currentMonthKey()

  const accounts = useLiveQuery(() => db.accounts.where({ userId: DEFAULT_USER_ID }).toArray())
  const totalBalance = accounts?.reduce((sum, a) => sum + a.balance, 0) ?? 0

  const budget = useLiveQuery(() => db.budgets.where({ userId: DEFAULT_USER_ID, month: monthKey }).first())

  const monthTransactions = useLiveQuery(async () => {
    const all = await db.transactions.where({ userId: DEFAULT_USER_ID }).toArray()
    return all.filter((t) => t.date.startsWith(monthKey))
  }, [monthKey])

  const totalExpense = monthTransactions?.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0) ?? 0
  const totalSaved = Math.max(0, (budget?.totalLimit ?? 0) - totalExpense)
  const available = Math.max(0, (budget?.totalLimit ?? 0) - totalExpense)
  const goalPercent = budget?.totalLimit ? Math.min(100, (totalExpense / budget.totalLimit) * 100) : 0

  const categories = useLiveQuery(() => db.categories.where({ userId: DEFAULT_USER_ID }).toArray())

  const categorySlices: CategorySlice[] = (categories ?? [])
    .map((c) => {
      const value = (monthTransactions ?? [])
        .filter((t) => t.categoryId === c.id && t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0)
      return { name: c.name, value, color: c.color }
    })
    .filter((s) => s.value > 0)

  return (
    <div className="space-y-5 pb-24 sm:pb-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Olá 👋</h1>
          <p className="text-sm text-muted">Nível {level.level} — {level.name}</p>
        </div>
        {streakDays > 0 && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-warn">
            <Flame size={18} /> {streakDays} dias
          </div>
        )}
      </header>

      <Card>
        <p className="text-xs text-muted uppercase tracking-wide">Quanto eu tenho</p>
        <p className="text-3xl font-semibold mt-1">{formatCurrency(totalBalance)}</p>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <p className="text-xs text-muted">Posso gastar</p>
            <p className="text-lg font-medium">{formatCurrency(available)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Já guardei</p>
            <p className="text-lg font-medium">{formatCurrency(totalSaved)}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-muted mb-1.5">
            <span>Meta do mês</span>
            <span>{goalPercent.toFixed(0)}%</span>
          </div>
          <ProgressBar value={goalPercent} />
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium mb-2">Seu dinheiro está indo para…</p>
        <CategoryDonutChart data={categorySlices} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
          {categorySlices.map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-muted">{s.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium mb-1">Progresso de nível</p>
        <p className="text-xs text-muted mb-2">{xp} XP acumulados</p>
        <ProgressBar value={progress * 100} />
      </Card>
    </div>
  )
}
