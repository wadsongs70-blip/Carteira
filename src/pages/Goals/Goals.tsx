import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db } from '@/database/db'
import { DEFAULT_USER_ID } from '@/database/schemas/seed'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/utils/format'
import { useAppStore } from '@/store/appStore'
import { Plus } from 'lucide-react'

export function Goals() {
  const goals = useLiveQuery(() => db.goals.where({ userId: DEFAULT_USER_ID }).toArray())
  const addToGoal = useAppStore((s) => s.addToGoal)

  const [creating, setCreating] = useState(false)
  const [contributingTo, setContributingTo] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [monthly, setMonthly] = useState('')
  const [contributionAmount, setContributionAmount] = useState('')

  async function handleCreate() {
    const targetAmount = parseFloat(target.replace(',', '.'))
    if (!name || !targetAmount) return
    await db.goals.add({
      userId: DEFAULT_USER_ID,
      name,
      icon: 'Target',
      targetAmount,
      currentAmount: 0,
      monthlyContribution: parseFloat(monthly.replace(',', '.')) || undefined,
      createdAt: new Date().toISOString(),
    })
    setName('')
    setTarget('')
    setMonthly('')
    setCreating(false)
  }

  async function handleContribute() {
    const amount = parseFloat(contributionAmount.replace(',', '.'))
    if (!contributingTo || !amount) return
    await addToGoal(contributingTo, amount)
    setContributingTo(null)
    setContributionAmount('')
  }

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Metas</h1>
        <button onClick={() => setCreating(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Nova meta
        </button>
      </div>

      {(!goals || goals.length === 0) && (
        <Card>
          <p className="text-sm text-muted text-center py-6">Crie sua primeira meta para começar a acompanhar seu progresso.</p>
        </Card>
      )}

      <div className="space-y-3">
        {goals?.map((g) => {
          const percent = Math.min(100, (g.currentAmount / g.targetAmount) * 100)
          const remaining = Math.max(0, g.targetAmount - g.currentAmount)
          const monthsToGo = g.monthlyContribution ? Math.ceil(remaining / g.monthlyContribution) : null

          return (
            <Card key={g.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{g.name}</p>
                <p className="text-sm text-muted">{formatCurrency(g.targetAmount)}</p>
              </div>
              <p className="text-sm mb-2">
                {formatCurrency(g.currentAmount)} <span className="text-muted">({percent.toFixed(0)}%)</span>
              </p>
              <ProgressBar value={percent} />
              {monthsToGo !== null && remaining > 0 && (
                <p className="text-xs text-muted mt-2">
                  Guardando {formatCurrency(g.monthlyContribution!)}/mês, você alcançará essa meta em aproximadamente {monthsToGo} {monthsToGo === 1 ? 'mês' : 'meses'}.
                </p>
              )}
              <button
                onClick={() => setContributingTo(g.id!)}
                className="btn-secondary text-xs mt-3"
              >
                Adicionar valor
              </button>
            </Card>
          )
        })}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Nova meta">
        <div className="space-y-3">
          <input
            className="w-full bg-transparent border-b border-black/10 dark:border-white/20 py-2 focus:outline-none focus:border-accent"
            placeholder="Nome da meta (ex.: Viagem)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full bg-transparent border-b border-black/10 dark:border-white/20 py-2 focus:outline-none focus:border-accent"
            placeholder="Valor total (R$)"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <input
            className="w-full bg-transparent border-b border-black/10 dark:border-white/20 py-2 focus:outline-none focus:border-accent"
            placeholder="Quanto pretende guardar por mês (opcional)"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
          />
          <button onClick={handleCreate} className="btn-primary w-full">Criar meta</button>
        </div>
      </Modal>

      <Modal open={contributingTo !== null} onClose={() => setContributingTo(null)} title="Adicionar valor à meta">
        <div className="space-y-3">
          <input
            className="w-full bg-transparent border-b border-black/10 dark:border-white/20 py-2 focus:outline-none focus:border-accent"
            placeholder="Valor (R$)"
            inputMode="decimal"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
          />
          <button onClick={handleContribute} className="btn-primary w-full">Confirmar</button>
        </div>
      </Modal>
    </div>
  )
}
