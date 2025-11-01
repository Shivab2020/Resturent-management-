import { useMemo, useState } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { toast } from 'sonner'
import data from '../data/mockData.json'

export default function AIAnalysis() {
  const [horizon, setHorizon] = useState(7)
  // Use profitTrend from mock data and normalize to { day, sales }
  const base = (data.profitTrend || []).map(d => ({ day: d.day, sales: d.profit }))
  const forecast = useMemo(() => {
    const last = base.length ? (base.slice(-3).reduce((s, d) => s + d.sales, 0) / Math.min(3, base.length)) : 0
    return Array.from({ length: horizon }, (_, i) => ({ day: `D+${i + 1}`, sales: Math.round(last * (1 + Math.sin(i) * 0.1)) }))
  }, [horizon])

  const combined = [...base, ...forecast]

  // Derive popularity from orders frequency (no hook to avoid memo crash)
  const counts = {}
  ;(data.orders || []).forEach(o => o.items.forEach(it => {
    counts[it.name] = (counts[it.name] || 0) + it.qty
  }))
  const topItems = (data.menu || []).map(m => ({ ...m, popularity: counts[m.name] || 0 }))
    .sort((a,b) => b.popularity - a.popularity)
    .slice(0,5)

  const generateInsights = () => {
    toast.info('AI generated insights (mock)')
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Analysis & Prediction</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">Forecast horizon</label>
          <select className="border rounded px-2 py-1" value={horizon} onChange={e => setHorizon(Number(e.target.value))}>
            {[7,14,30].map(h => <option key={h} value={h}>{h} days</option>)}
          </select>
          <button className="btn btn-primary" onClick={generateInsights}>Generate Insights</button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">Sales Forecast</h3>
        {base.length === 0 ? (
          <p className="text-sm text-red-600">No base data available.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={combined}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#7c3aed" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Top Performing Items</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={topItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="popularity" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Staff Utilization (Mock)</h3>
          <p className="text-sm text-gray-600">AI suggests adding one extra staff on weekends between 7–9 pm to reduce order wait time by ~12%.</p>
        </div>
      </div>
    </div>
  )
}