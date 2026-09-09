import { db } from '@/database/db'
import type { Category } from '@/types'

export const DEFAULT_USER_ID = 'user_001'

const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { userId: DEFAULT_USER_ID, name: 'Casa', icon: 'Home', color: '#1F6F54', type: 'expense' },
  { userId: DEFAULT_USER_ID, name: 'Alimentação', icon: 'UtensilsCrossed', color: '#B45309', type: 'expense' },
  { userId: DEFAULT_USER_ID, name: 'Transporte', icon: 'Car', color: '#2563EB', type: 'expense' },
  { userId: DEFAULT_USER_ID, name: 'Lazer', icon: 'Gamepad2', color: '#7C3AED', type: 'expense' },
  { userId: DEFAULT_USER_ID, name: 'Compras', icon: 'ShoppingBag', color: '#DB2777', type: 'expense' },
  { userId: DEFAULT_USER_ID, name: 'Saúde', icon: 'HeartPulse', color: '#DC2626', type: 'expense' },
  { userId: DEFAULT_USER_ID, name: 'Outros', icon: 'MoreHorizontal', color: '#6B7280', type: 'expense' },
  { userId: DEFAULT_USER_ID, name: 'Salário', icon: 'Wallet', color: '#1F6F54', type: 'income' },
  { userId: DEFAULT_USER_ID, name: 'Freelance', icon: 'Laptop', color: '#0EA5E9', type: 'income' },
]

export async function ensureSeedData() {
  const categoryCount = await db.categories.where({ userId: DEFAULT_USER_ID }).count()
  if (categoryCount === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES)
  }

  const settingsCount = await db.settings.where({ userId: DEFAULT_USER_ID }).count()
  if (settingsCount === 0) {
    await db.settings.add({
      userId: DEFAULT_USER_ID,
      theme: 'light',
      xp: 0,
      streakDays: 0,
    })
  }

  const accountCount = await db.accounts.where({ userId: DEFAULT_USER_ID }).count()
  if (accountCount === 0) {
    await db.accounts.add({
      userId: DEFAULT_USER_ID,
      name: 'Conta principal',
      balance: 0,
      kind: 'checking',
    })
  }
}
