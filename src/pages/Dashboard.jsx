import ChartCard from '../components/ChartCard'
import data from '../data/mockData.json'

export default function Dashboard() {
  const { stats, salesData, profitTrend, bestSelling } = data
  return (
    <div className="grid gap-6">
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
        <StatCard label="Expenses" value={`₹${stats.expenses.toLocaleString()}`} />
        <StatCard label="Profit" value={`₹${stats.profit.toLocaleString()}`} />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Daily Sales" type="line" data={salesData} dataKey="sales" xKey="name" />
        <ChartCard title="Profit Trend" type="area" data={profitTrend} dataKey="profit" xKey="day" />
      </section>

      <section className="card p-4">
        <h3 className="font-semibold mb-2">Best-selling Dish</h3>
        <p className="text-gray-700 dark:text-gray-300">{bestSelling.name}</p>
        <p className="text-sm text-gray-500">Ordered {bestSelling.count} times today</p>
      </section>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}