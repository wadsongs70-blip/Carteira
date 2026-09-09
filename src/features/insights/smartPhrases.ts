import { formatCurrency } from '@/utils/format'

interface ImpulseContext {
  amount: number
  availableThisMonth: number
}

export function getImpulsePercentPhrase({ amount, availableThisMonth }: ImpulseContext): string {
  if (availableThisMonth <= 0) {
    return `Esse valor representa mais do que você tem disponível este mês.`
  }
  const percent = (amount / availableThisMonth) * 100
  return `Esse valor representa ${percent.toFixed(1)}% do seu dinheiro disponível este mês.`
}

export function getImpulseQuestionPhrase(amount: number): string {
  const phrases = [
    `Você quer esse produto ou quer os ${formatCurrency(amount)} que ele representa no seu futuro?`,
    `Você realmente precisa disso agora?`,
    `Se você não comprar isso, esse dinheiro pode virar patrimônio.`,
  ]
  return phrases[Math.floor(Math.random() * phrases.length)]
}

export function getGoalProximityPhrase(remaining: number): string {
  return `Você está a ${formatCurrency(remaining)} da sua meta. Essa compra pode esperar?`
}

export function getGoalAccelerationPhrase(daysEarlier: number): string {
  if (daysEarlier <= 0) return ''
  return `Se você não comprar isso, sua meta chegará ${daysEarlier} dias mais cedo.`
}

export function getOverspendingPhrase(categoryName: string, diffVsLastMonth: number): string {
  return `⚠️ Seu maior aumento foi em ${categoryName}. Você gastou ${formatCurrency(
    diffVsLastMonth
  )} a mais que no mês passado.`
}

export function getSavingsCelebrationPhrase(amount: number): string {
  return `Você economizou ${formatCurrency(
    amount
  )} este mês. Isso não é apenas dinheiro guardado. É liberdade comprada antecipadamente.`
}

export function getGoalReachedPhrase(): string {
  return `Meta atingida 🎯 Você disse que queria. Você planejou. Você fez.`
}

export function getOverBudgetPhrase(): string {
  return `Calma. Seu dinheiro está tentando te dizer alguma coisa.`
}

export function projectFutureValue(monthlyAmount: number) {
  return {
    oneYear: monthlyAmount * 12,
    threeYears: monthlyAmount * 36,
    fiveYears: monthlyAmount * 60,
  }
}
