import { LEVELS } from '@/types'

export const XP_RULES = {
  IMPULSE_AVOIDED: 250,
  DAY_WITHOUT_IMPULSE_PURCHASE: 50,
  GOAL_REACHED: 500,
  UNDER_BUDGET_MONTH: 300,
  TRANSACTION_LOGGED: 5,
  RESERVE_INCREASED: 100,
  DEBT_PAID: 200,
} as const

export function getLevelForXp(xp: number) {
  return LEVELS.find((l) => xp >= l.min && xp < l.max) ?? LEVELS[LEVELS.length - 1]
}

export function getLevelProgress(xp: number) {
  const level = getLevelForXp(xp)
  if (level.max === Infinity) return { level, progress: 1, xpIntoLevel: xp - level.min, xpForNext: 0 }
  const xpIntoLevel = xp - level.min
  const xpForNext = level.max - level.min
  return { level, progress: xpIntoLevel / xpForNext, xpIntoLevel, xpForNext }
}
