import { useMemo, useState } from 'react'
import data from '../data/mockData.json'
import { toast } from 'sonner'

export default function CRM() {
  const [customers, setCustomers] = useState(data.customers)
  const [filterTop, setFilterTop] = useState(false)
  const shown = useMemo(() => customers.filter(c => !filterTop || c.visits >= 10), [customers, filterTop])

  const sendOffer = (c) => {
    toast.info(`Offer sent to ${c.name} (mock)`) 
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Customer Loyalty & CRM</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={filterTop} onChange={e => setFilterTop(e.target.checked)} />
          Top Customers (≥ 10 visits)
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((c, i) => (
          <div className="card p-4" key={i}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-600">Favorite: {c.favorite}</p>
              </div>
              <span className="badge badge-gray">Visits: {c.visits}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Points: {c.points}</span>
              <button className="btn btn-primary" onClick={() => sendOffer(c)}>Send Offer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}