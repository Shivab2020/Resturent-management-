import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import data from '../data/mockData.json'
import { toast } from 'sonner'

export default function QROrder() {
  const [params] = useSearchParams()
  const table = Number(params.get('table') || 0)
  const [sel, setSel] = useState([])
  const [note, setNote] = useState('')
  const [coupon, setCoupon] = useState('')
  const [tip, setTip] = useState(0)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const categories = ['All', ...Array.from(new Set((data.menu || []).map(m => m.category)))]
  const menu = (data.menu || []).filter(m => m.available)
    .filter(m => (cat === 'All' || m.category === cat) && (!search || m.name.toLowerCase().includes(search.toLowerCase())))

  const addItem = (id) => {
    const found = menu.find(m => m.id === Number(id))
    if (!found) return
    setSel(prev => {
      const ex = prev.find(p => p.id === found.id)
      if (ex) return prev.map(p => p.id === found.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { id: found.id, name: found.name, qty: 1, price: found.price }]
    })
  }

  const subtotal = useMemo(() => sel.reduce((s, it) => s + it.qty * it.price, 0), [sel])
  const discount = useMemo(() => {
    if (coupon.toUpperCase() === 'SAVE10') return Math.round(subtotal * 0.1)
    if (coupon.toUpperCase() === 'SAVE20') return Math.round(subtotal * 0.2)
    return 0
  }, [coupon, subtotal])
  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal])
  const tipAmt = useMemo(() => Math.round(subtotal * (tip / 100)), [subtotal, tip])
  const total = useMemo(() => Math.max(0, subtotal - discount) + tax + tipAmt, [subtotal, discount, tax, tipAmt])
  const etaMin = useMemo(() => 10 + sel.reduce((s, it) => s + it.qty, 0) * 3, [sel])

  const placeOrder = () => {
    if (!table || sel.length === 0) return
    const order = {
      id: Date.now(),
      table,
      items: sel.map(s => ({ name: s.name, qty: s.qty, price: s.price })),
      status: 'Pending',
      billTotal: total,
      note
    }
    const existing = JSON.parse(localStorage.getItem('qr_orders') || '[]')
    localStorage.setItem('qr_orders', JSON.stringify([order, ...existing]))
    window.dispatchEvent(new Event('qr_orders_updated'))
    toast.success(`Order placed for Table ${table}`)
    setSel([])
    setNote('')
    setCoupon('')
    setTip(0)
  }

  return (
    <div className="grid gap-4 max-w-3xl mx-auto px-3 pb-32">
      <h2 className="text-xl font-semibold">QR Order</h2>
      {table ? (
        <p className="text-sm text-gray-600">Table {table} • Pick items and confirm the order.</p>
      ) : (
        <p className="text-sm text-red-600">No table specified. Open from a table QR or select below.</p>
      )}

      {!table && (
        <div className="card p-4">
          <label className="text-sm text-gray-600">Select table</label>
          <select className="border rounded px-2 py-1" onChange={e => window.location.search = `?table=${e.target.value}`} defaultValue="">
            <option value="" disabled>Choose</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(t => <option key={t} value={t}>Table {t}</option>)}
          </select>
        </div>
      )}

      <div className="card p-4">
        <div className="grid md:grid-cols-3 gap-2">
          <div>
            <label className="text-sm text-gray-600">Search</label>
            <input className="border rounded px-2 py-1 w-full" placeholder="Find dishes" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <select className="border rounded px-2 py-1 w-full" value={cat} onChange={e => setCat(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Quick Add</label>
            <select className="border rounded px-2 py-1 w-full" onChange={e => addItem(e.target.value)} defaultValue="">
              <option value="" disabled>Select item</option>
              {menu.map(m => (
                <option key={m.id} value={m.id}>{m.name} — ₹{m.price}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {menu.map(m => (
            <div key={m.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-gray-600">{m.category}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{m.price}</div>
                <button className="btn btn-outline mt-1" onClick={() => addItem(m.id)}>Add</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Your Order</h4>
          <div className="space-y-2">
            {sel.map(item => (
              <div className="flex items-center justify-between" key={item.id}>
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button className="btn btn-outline" onClick={() => setSel(sel.map(s => s.id === item.id ? { ...s, qty: Math.max(1, s.qty - 1) } : s))}>-</button>
                  <span>{item.qty}</span>
                  <button className="btn btn-outline" onClick={() => setSel(sel.map(s => s.id === item.id ? { ...s, qty: s.qty + 1 } : s))}>+</button>
                  <button className="btn btn-ghost" onClick={() => setSel(sel.filter(s => s.id !== item.id))}>Remove</button>
                  <span className="w-24 text-right">₹{(item.qty * item.price).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          {sel.length > 0 && (
            <div className="mt-2 flex justify-end">
              <button className="btn btn-ghost" onClick={() => setSel([])}>Clear Cart</button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="text-sm text-gray-600">Note for kitchen</label>
            <textarea className="border rounded px-2 py-1 w-full" placeholder="e.g., less spicy" value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Coupon</label>
            <div className="flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" placeholder="SAVE10 or SAVE20" value={coupon} onChange={e => setCoupon(e.target.value)} />
              <button className="btn btn-outline" onClick={() => toast.info('Coupon applied (mock)')}>Apply</button>
            </div>
            <div className="mt-2">
              <label className="text-sm text-gray-600">Tip</label>
              <div className="flex gap-2 mt-1">
                {[0,5,10].map(p => (
                  <button key={p} className={`btn ${tip===p?'btn-primary':'btn-outline'}`} onClick={() => setTip(p)}>{p}%</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-2 space-y-1">
          <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Discount</span><span>- ₹{discount.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Tax (18%)</span><span>₹{tax.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Tip</span><span>₹{tipAmt.toLocaleString()}</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <div className="text-xs text-gray-500">Estimated prep time: {etaMin} mins</div>
        </div>

        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[96%] max-w-3xl">
          <div className="card p-2 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
              <div className="font-semibold">₹{total.toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => setSel([])} disabled={sel.length===0}>Clear</button>
              <button className="btn btn-primary btn-sm" onClick={placeOrder} disabled={!table || sel.length === 0}>Place Order</button>
              <Link className="btn btn-ghost btn-sm" to="/orders">Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}