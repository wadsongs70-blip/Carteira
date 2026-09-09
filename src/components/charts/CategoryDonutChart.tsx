import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/utils/format'

export interface CategorySlice {
  name: string
  value: number
  color: string
}

export function CategoryDonutChart({ data }: { data: CategorySlice[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted text-center py-10">Nenhuma despesa registrada ainda.</p>
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
