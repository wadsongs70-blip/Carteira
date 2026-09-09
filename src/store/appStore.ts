import { create } from 'zustand'
import { db } from '@/database/db'
import { DEFAULT_USER_ID } from '@/database/schemas/seed'
import { XP_RULES } from '@/features/achievements/xp'
import type { Transaction, Goal, Settings } from '@/types'

interface AppState {
  userId: string
  theme: 'light' | 'dark'
  xp: number
  streakDays: number
  loaded: boolean

  init: () => Promise<void>
  toggleTheme: () => Promise<void>
  addXp: (amount: number, type: string, description: string) => Promise<void>

  addTransaction: (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>
  markImpulseAvoided: (amount: number) => Promise<void>

  addToGoal: (goalId: number, amount: number) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  userId: DEFAULT_USER_ID,
  theme: 'light',
  xp: 0,
  streakDays: 0,
  loaded: false,

  init: async () => {
    const settings = await db.settings.where({ userId: DEFAULT_USER_ID }).first()
    if (settings) {
      set({ theme: settings.theme, xp: settings.xp, streakDays: settings.streakDays })
      applyThemeClass(settings.theme)
    }
    set({ loaded: true })
  },

  toggleTheme: async () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: next })
    applyThemeClass(next)
    await updateSettings({ theme: next })
  },

  addXp: async (amount, type, description) => {
    const newXp = get().xp + amount
    set({ xp: newXp })
    await updateSettings({ xp: newXp })
    await db.achievements.add({
      userId: DEFAULT_USER_ID,
      type,
      xp: amount,
      description,
      createdAt: new Date().toISOString(),
    })
  },

  addTransaction: async (tx) => {
    await db.transactions.add({
      ...tx,
      userId: DEFAULT_USER_ID,
      createdAt: new Date().toISOString(),
    })
    if (tx.accountId) {
      const account = await db.accounts.get(tx.accountId)
      if (account) {
        const delta = tx.type === 'income' ? tx.amount : -tx.amount
        await db.accounts.update(tx.accountId, { balance: account.balance + delta })
      }
    }
    await get().addXp(XP_RULES.TRANSACTION_LOGGED, 'transaction_logged', 'Registrou uma movimentação')
  },

  markImpulseAvoided: async (amount) => {
    await get().addXp(
      XP_RULES.IMPULSE_AVOIDED,
      'impulse_avoided',
      `Evitou uma compra por impulso de R$ ${amount.toFixed(2)}`
    )
  },

  addToGoal: async (goalId, amount) => {
    const goal = await db.goals.get(goalId)
    if (!goal) return
    const newAmount = goal.currentAmount + amount
    await db.goals.update(goalId, { currentAmount: newAmount })
    if (newAmount >= goal.targetAmount && goal.currentAmount < goal.targetAmount) {
      await get().addXp(XP_RULES.GOAL_REACHED, 'goal_reached', `Meta "${goal.name}" atingida`)
    }
  },
}))

function applyThemeClass(theme: 'light' | 'dark') {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

async function updateSettings(patch: Partial<Settings>) {
  const existing = await db.settings.where({ userId: DEFAULT_USER_ID }).first()
  if (existing?.id) {
    await db.settings.update(existing.id, patch)
  }
}

export type { Goal }
