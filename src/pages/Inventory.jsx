import { toast } from 'sonner'
import data from '../data/mockData.json'
import { useState } from 'react'

export default function Inventory() {
  const [items, setItems] = useState(data.inventory)

  const restock = (idx) => {
    const next = [...items]
    next[idx].qty += 10
    next[idx].status = 'OK'
    setItems(next)
    toast.success('Stock Updated!')
  }

  const colorBadge = (status) => {
    if (status === 'Low') return 'badge-red'
    if (status === 'Expired') return 'badge-yellow'
    return 'badge-green'
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Inventory Tracker</h2>
      <div className="card overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 text-sm font-semibold">Item</th>
              <th className="p-3 text-sm font-semibold">Quantity Left</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{it.name}</td>
                <td className="p-3">{it.qty}</td>
                <td className="p-3"><span className={`badge ${colorBadge(it.status)}`}>{it.status}</span></td>
                <td className="p-3"><button className="btn btn-outline" onClick={() => restock(idx)}>Restock</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}