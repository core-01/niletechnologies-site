import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { monthlyLoanStats } from '@/data/mockData'

export default function ApprovalBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={monthlyLoanStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf3" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7c92ac' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#7c92ac' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e9edf3', fontSize: 13 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="approved" fill="#17b8a6" name="Approved" radius={[6, 6, 0, 0]} />
        <Bar dataKey="rejected" fill="#e5566a" name="Rejected" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
