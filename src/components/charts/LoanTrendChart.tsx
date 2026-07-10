import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { monthlyLoanStats } from '@/data/mockData'

export default function LoanTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyLoanStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="applications" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3d63f2" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#3d63f2" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="approved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#17b8a6" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#17b8a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf3" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7c92ac' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#7c92ac' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e9edf3', fontSize: 13 }} />
        <Area type="monotone" dataKey="applications" stroke="#3d63f2" strokeWidth={2} fill="url(#applications)" name="Applications" />
        <Area type="monotone" dataKey="approved" stroke="#17b8a6" strokeWidth={2} fill="url(#approved)" name="Approved" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
