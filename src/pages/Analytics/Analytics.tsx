import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db } from '@/database/db'
import { DEFAULT_USER_ID } from '@/database/schemas/seed'
import { Card } from '@/components/ui/Card'
import { MonthComparisonChart } from '@/components/charts/MonthComparisonChart'
import { formatCurrency, currentMonthKey } from '@/utils/format'
import { getOverspendingPhrase, projectFutureValue } from '@/features/insights/smartPhrases'
import { addMonths } from 'date-fns'

export function Analytics() {
  const now = new Date()
  const thisMonthKey = currentMonthKey(now)
  const lastMonthKey = currentMonthKey(addMonths(now, -1))

  const categories = useLiveQuery(() => db.categories.where({ userId: DEFAULT_USER_ID }).toArray())

  const allTransactions = useLiveQuery(() => db.transactions.where({ userId: DEFAULT_USER_ID }).toArray())

  const thisMonthExpenses = (allTransactions ?? []).filter(
    (t) => t.type === 'expense' && t.date.startsWith(thisMonthKey)
  )
  const lastMonthExpenses = (allTransactions ?? []).filter(
    (t) => t.type === 'expense' && t.date.startsWith(lastMonthKey)
  )

  const totalThisMonth = thisMonthExpenses.reduce((s, t) => s + t.amount, 0)
  const totalLastMonth = lastMonthExpenses.reduce((s, t) => s + t.amount, 0)
  const percentChange = totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0

  // categoria com maior aumento
  let biggestIncreaseCategory: string | null = null
  let biggestIncreaseValue = 0
  categories?.forEach((c) => {
    const thisVal = thisMonthExpenses.filter((t) => t.categoryId === c.id).reduce((s, t) => s + t.amount, 0)
    const lastVal = lastMonthExpenses.filter((t) => t.categoryId === c.id).reduce((s, t) => s + t.amount, 0)
    const diff = thisVal - lastVal
    if (diff > biggestIncreaseValue) {
      biggestIncreaseValue = diff
      biggestIncreaseCategory = c.name
    }
  })

  const [simAmount, setSimAmount] = useState('300')
  const numericSim = parseFloat(simAmount.replace(',', '.')) || 0
  const projection = projectFutureValue(numericSim)

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      <h1 className="text-2xl font-semibold tracking-tight">Análise</h1>

      <Card>
        <p className="text-sm font-medium mb-1">Onde seu dinheiro está indo?</p>
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-2xl font-semibold">{formatCurrency(totalThisMonth)}</p>
          {totalLastMonth > 0 && (
            <span className={`text-xs font-medium ${percentChange >= 0 ? 'text-danger' : 'text-accent'}`}>
              {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange).toFixed(1)}%
            </span>
          )}
        </div>
        <MonthComparisonChart currentMonth={totalThisMonth} lastMonth={totalLastMonth} />
        {biggestIncreaseCategory && (
          <p className="text-xs text-muted mt-3">
            {getOverspendingPhrase(biggestIncreaseCategory, biggestIncreaseValue)}
          </p>
        )}
      </Card>

      <Card>
        <p className="text-sm font-medium mb-2">🧠 RAIO-X</p>
        <p className="text-sm text-muted">
          Analisando seus últimos registros, acompanhe de perto as categorias com maior variação — pequenos ajustes recorrentes costumam ter mais impacto do que cortes pontuais.
        </p>
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3">O que acontece se eu guardar esse dinheiro?</p>
        <input
          className="w-full bg-transparent border-b border-black/10 dark:border-white/20 text-xl font-semibold py-2 mb-4 focus:outline-none focus:border-accent"
          inputMode="decimal"
          value={simAmount}
          onChange={(e) => setSimAmount(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-muted">1 ano</p>
            <p className="font-semibold">{formatCurrency(projection.oneYear)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">3 anos</p>
            <p className="font-semibold">{formatCurrency(projection.threeYears)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">5 anos</p>
            <p className="font-semibold">{formatCurrency(projection.fiveYears)}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
