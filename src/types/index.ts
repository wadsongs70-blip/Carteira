export type TransactionType = 'expense' | 'income' | 'transfer'

export interface Category {
  id?: number
  userId: string
  name: string
  icon: string // nome do ícone lucide-react
  color: string // hex
  type: TransactionType
}

export interface Account {
  id?: number
  userId: string
  name: string
  balance: number
  kind: 'checking' | 'savings' | 'cash' | 'other'
}

export interface Card {
  id?: number
  userId: string
  name: string
  limit: number
  used: number
  closingDay: number
  dueDay: number
}

export interface Transaction {
  id?: number
  userId: string
  type: TransactionType
  amount: number
  description: string
  categoryId?: number
  accountId?: number
  date: string // ISO
  createdAt: string // ISO
  wasImpulseAvoided?: boolean
}

export interface RecurringTransaction {
  id?: number
  userId: string
  description: string
  amount: number
  dayOfMonth: number
  categoryId?: number
  type: TransactionType
}

export interface Budget {
  id?: number
  userId: string
  month: string // 'YYYY-MM'
  totalLimit: number
}

export interface Goal {
  id?: number
  userId: string
  name: string
  icon: string
  targetAmount: number
  currentAmount: number
  monthlyContribution?: number
  createdAt: string
}

export interface Achievement {
  id?: number
  userId: string
  type: string
  xp: number
  description: string
  createdAt: string
}

export interface FinancialSnapshot {
  id?: number
  userId: string
  month: string // 'YYYY-MM'
  totalIncome: number
  totalExpense: number
  totalSaved: number
}

export interface Settings {
  id?: number
  userId: string
  theme: 'light' | 'dark'
  xp: number
  streakDays: number
  lastActiveDate?: string
}

export const LEVELS = [
  { level: 1, name: 'Iniciante', min: 0, max: 1000 },
  { level: 2, name: 'Organizado', min: 1000, max: 3000 },
  { level: 3, name: 'Disciplinado', min: 3000, max: 7500 },
  { level: 4, name: 'Investidor', min: 7500, max: 15000 },
  { level: 5, name: 'Patrimônio', min: 15000, max: Infinity },
] as const
