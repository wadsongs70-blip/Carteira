import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Modal } from '@/components/ui/Modal'
import { db } from '@/database/db'
import { DEFAULT_USER_ID } from '@/database/schemas/seed'
import { useAppStore } from '@/store/appStore'
import { formatCurrency } from '@/utils/format'
import { getImpulsePercentPhrase, getImpulseQuestionPhrase } from '@/features/insights/smartPhrases'
import type { TransactionType } from '@/types'

interface QuickAddModalProps {
  open: boolean
  onClose: () => void
}

type Step = 'form' | 'impulse-check'

export function QuickAddModal({ open, onClose }: QuickAddModalProps) {
  const [step, setStep] = useState<Step>('form')
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [accountId, setAccountId] = useState<number | undefined>()

  const categories = useLiveQuery(
    () => db.categories.where({ userId: DEFAULT_USER_ID, type }).toArray(),
    [type]
  )
  const accounts = useLiveQuery(() => db.accounts.where({ userId: DEFAULT_USER_ID }).toArray())
  const addTransaction = useAppStore((s) => s.addTransaction)
  const markImpulseAvoided = useAppStore((s) => s.markImpulseAvoided)

  const availableThisMonth = useLiveQuery(async () => {
    const budget = await db.budgets
      .where({ userId: DEFAULT_USER_ID })
      .first()
    return budget?.totalLimit ?? 2000
  })

  const numericAmount = parseFloat(amount.replace(',', '.')) || 0

  function reset() {
    setStep('form')
    setAmount('')
    setDescription('')
    setCategoryId(undefined)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit() {
    if (!numericAmount || !description) return

    // Diferencial do app: para despesas relevantes, pergunta antes de confirmar
    const isSignificant = type === 'expense' && numericAmount >= 100
    if (isSignificant) {
      setStep('impulse-check')
      return
    }
    await confirmTransaction()
  }

  async function confirmTransaction() {
    await addTransaction({
      type,
      amount: numericAmount,
      description,
      categoryId,
      accountId,
      date: new Date().toISOString(),
    })
    handleClose()
  }

  async function handleSaveInstead() {
    await markImpulseAvoided(numericAmount)
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={step === 'form' ? 'Nova movimentação' : 'Pense antes de confirmar'}>
      {step === 'form' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['expense', 'income', 'transfer'] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                  type === t ? 'bg-accent text-white' : 'bg-black/5 dark:bg-white/10'
                }`}
              >
                {t === 'expense' ? 'Despesa' : t === 'income' ? 'Receita' : 'Transferência'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-muted">Valor (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full mt-1 bg-transparent border-b border-black/10 dark:border-white/20 text-2xl font-semibold py-2 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs text-muted">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: tênis, mercado, salário..."
              className="w-full mt-1 bg-transparent border-b border-black/10 dark:border-white/20 py-2 focus:outline-none focus:border-accent"
            />
          </div>

          {type !== 'transfer' && (
            <div>
              <label className="text-xs text-muted">Categoria</label>
              <select
                value={categoryId ?? ''}
                onChange={(e) => setCategoryId(Number(e.target.value) || undefined)}
                className="w-full mt-1 bg-transparent border-b border-black/10 dark:border-white/20 py-2 focus:outline-none focus:border-accent"
              >
                <option value="">Selecione</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-muted">Conta</label>
            <select
              value={accountId ?? ''}
              onChange={(e) => setAccountId(Number(e.target.value) || undefined)}
              className="w-full mt-1 bg-transparent border-b border-black/10 dark:border-white/20 py-2 focus:outline-none focus:border-accent"
            >
              <option value="">Selecione</option>
              {accounts?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSubmit} className="btn-primary w-full mt-2">
            Continuar
          </button>
        </div>
      )}

      {step === 'impulse-check' && (
        <div className="space-y-4 text-center">
          <p className="text-3xl font-semibold">{formatCurrency(numericAmount)}</p>
          <p className="text-sm text-muted">
            {getImpulsePercentPhrase({ amount: numericAmount, availableThisMonth: availableThisMonth ?? 2000 })}
          </p>
          <p className="text-sm">{getImpulseQuestionPhrase(numericAmount)}</p>

          <div className="flex flex-col gap-2 pt-2">
            <button onClick={confirmTransaction} className="btn-secondary">
              Comprar mesmo assim
            </button>
            <button onClick={handleSaveInstead} className="btn-primary">
              Guardar {formatCurrency(numericAmount)} em vez disso
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
