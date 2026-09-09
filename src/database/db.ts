import Dexie, { type Table } from 'dexie'
import type {
  Account,
  Achievement,
  Budget,
  Card,
  Category,
  FinancialSnapshot,
  Goal,
  RecurringTransaction,
  Settings,
  Transaction,
} from '@/types'

export class FortunaDB extends Dexie {
  accounts!: Table<Account, number>
  transactions!: Table<Transaction, number>
  categories!: Table<Category, number>
  budgets!: Table<Budget, number>
  goals!: Table<Goal, number>
  cards!: Table<Card, number>
  recurringTransactions!: Table<RecurringTransaction, number>
  achievements!: Table<Achievement, number>
  financialSnapshots!: Table<FinancialSnapshot, number>
  settings!: Table<Settings, number>

  constructor() {
    super('fortuna-db')
    this.version(1).stores({
      accounts: '++id, userId, name',
      transactions: '++id, userId, type, categoryId, accountId, date',
      categories: '++id, userId, type, name',
      budgets: '++id, userId, month',
      goals: '++id, userId, name',
      cards: '++id, userId, name',
      recurringTransactions: '++id, userId, dayOfMonth',
      achievements: '++id, userId, type, createdAt',
      financialSnapshots: '++id, userId, month',
      settings: '++id, userId',
    })
  }
}

export const db = new FortunaDB()
