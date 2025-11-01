import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function ChartCard({ title, type = 'line', data, dataKey = 'sales', xKey = 'name' }) {
  const colors = ['#FFA500', '#FF7A00', '#FFC44D', '#E69500']
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey={xKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey={dataKey} stroke="#FFA500" strokeWidth={2} dot={false} />
            </LineChart>
          )}
          {type === 'area' && (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey={xKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Area type="monotone" dataKey={dataKey} stroke="#FF7A00" fill="#FFE6B8" strokeWidth={2} />
            </AreaChart>
          )}
          {type === 'bar' && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey={xKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#FFA500" />
            </BarChart>
          )}
          {type === 'pie' && (
            <PieChart>
              <Tooltip />
              <Pie data={data} dataKey={dataKey} nameKey={xKey} outerRadius={100}>
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}