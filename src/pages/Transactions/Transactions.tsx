import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import { DEFAULT_USER_ID } from '@/database/schemas/seed'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react'

export function Transactions() {
  const transactions = useLiveQuery(async () => {
    const all = await db.transactions.where({ userId: DEFAULT_USER_ID }).toArray()
    return all.sort((a, b) => (a.date < b.date ? 1 : -1))
  })

  const categories = useLiveQuery(() => db.categories.where({ userId: DEFAULT_USER_ID }).toArray())
  const categoryName = (id?: number) => categories?.find((c) => c.id === id)?.name ?? '—'

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      <h1 className="text-2xl font-semibold tracking-tight">Movimentações</h1>

      <Card className="divide-y divide-black/5 dark:divide-white/10 p-0">
        {(!transactions || transactions.length === 0) && (
          <p className="text-sm text-muted text-center py-10 px-5">
            Nenhuma movimentação ainda. Toque em “+” para registrar a primeira.
          </p>
        )}
        {transactions?.map((t) => (
          <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
            <div
              className={`p-2 rounded-full ${
                t.type === 'income'
                  ? 'bg-accent-soft text-accent'
                  : t.type === 'transfer'
                  ? 'bg-black/5 dark:bg-white/10 text-muted'
                  : 'bg-danger/10 text-danger'
              }`}
            >
              {t.type === 'income' ? <ArrowDownLeft size={16} /> : t.type === 'transfer' ? <ArrowLeftRight size={16} /> : <ArrowUpRight size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.description}</p>
              <p className="text-xs text-muted">
                {categoryName(t.categoryId)} · {format(parseISO(t.date), "d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-accent' : ''}`}>
              {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}
              {formatCurrency(t.amount)}
            </p>
          </div>
        ))}
      </Card>
    </div>
  )
}
