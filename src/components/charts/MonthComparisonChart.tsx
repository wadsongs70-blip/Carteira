import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { formatCurrency } from '@/utils/format'

export function MonthComparisonChart({
  currentMonth,
  lastMonth,
}: {
  currentMonth: number
  lastMonth: number
}) {
  const data = [
    { name: 'Mês passado', value: lastMonth },
    { name: 'Este mês', value: currentMonth },
  ]

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-10" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis hide />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Bar dataKey="value" fill="#1F6F54" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
