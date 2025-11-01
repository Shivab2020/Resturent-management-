import { useEffect, useMemo, useState } from 'react'
import data from '../data/mockData.json'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, CheckCircle, Receipt } from 'lucide-react'
import InvoiceModal from '../components/InvoiceModal'

export default function Orders() {
  const loadQrOrders = () => {
    try { return JSON.parse(localStorage.getItem('qr_orders') || '[]') } catch { return [] }
  }
  const [orders, setOrders] = useState(() => [...loadQrOrders(), ...data.orders])
  const [menu] = useState(data.menu)
  const [openNew, setOpenNew] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [invoiceOpen, setInvoiceOpen] = useState(false)

  useEffect(() => {
    const update = () => setOrders([...loadQrOrders(), ...data.orders])
    update()
    window.addEventListener('qr_orders_updated', update)
    return () => window.removeEventListener('qr_orders_updated', update)
  }, [])

  const addOrder = (payload) => {
    const billTotal = payload.items.reduce((s, it) => s + it.qty * it.price, 0)
    const order = { id: Date.now(), table: payload.table, items: payload.items, status: 'Pending', billTotal }
    const existing = loadQrOrders()
    localStorage.setItem('qr_orders', JSON.stringify([order, ...existing]))
    window.dispatchEvent(new Event('qr_orders_updated'))
    setOpenNew(false)
  }

  const markReady = (order) => {
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Ready' } : o))
    // Persist status for QR orders
    const existing = loadQrOrders()
    if (existing.find(o => o.id === order.id)) {
      const updated = existing.map(o => o.id === order.id ? { ...o, status: 'Ready' } : o)
      localStorage.setItem('qr_orders', JSON.stringify(updated))
      window.dispatchEvent(new Event('qr_orders_updated'))
    }
  }

  const handleInvoice = (order) => {
    setSelectedOrder(order)
    setInvoiceOpen(true)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Dialog.Root open={openNew} onOpenChange={setOpenNew}>
          <Dialog.Trigger asChild>
            <button className="btn btn-primary"><Plus size={16} /> Add Order</button>
          </Dialog.Trigger>
          <NewOrderDialog menu={menu} onCreate={addOrder} />
        </Dialog.Root>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-[800px]">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 text-sm font-semibold">Order #</th>
              <th className="p-3 text-sm font-semibold">Table</th>
              <th className="p-3 text-sm font-semibold">Items</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Bill Total</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-3">#{order.id}</td>
                <td className="p-3">{order.table}</td>
                <td className="p-3 text-sm text-gray-600">
                  {order.items.map((it, i) => (
                    <span key={i}>
                      {it.name} × {it.qty}{i < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td className="p-3">
                  <span className={`badge ${order.status === 'Ready' ? 'badge-green' : order.status === 'Pending' ? 'badge-yellow' : 'badge-gray'}`}>{order.status}</span>
                </td>
                <td className="p-3">₹{order.billTotal.toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  <button className="btn btn-outline" onClick={() => markReady(order)}><CheckCircle size={16} /> Mark as Ready</button>
                  <button className="btn btn-ghost" onClick={() => handleInvoice(order)}><Receipt size={16} /> Generate Bill</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvoiceModal open={invoiceOpen} onOpenChange={setInvoiceOpen} order={selectedOrder} />

      <ReservationSection />
    </div>
  )
}

function NewOrderDialog({ menu, onCreate }) {
  const [table, setTable] = useState('')
  const [sel, setSel] = useState([])

  const addItem = (itemId) => {
    const found = menu.find(m => m.id === Number(itemId))
    if (!found) return
    setSel(prev => {
      const existing = prev.find(p => p.id === found.id)
      if (existing) return prev.map(p => p.id === found.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { id: found.id, name: found.name, qty: 1, price: found.price }]
    })
  }

  const removeItem = (id) => setSel(sel.filter(s => s.id !== id))

  const total = useMemo(() => sel.reduce((s, it) => s + it.qty * it.price, 0), [sel])

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg card p-4">
        <Dialog.Title className="font-semibold text-lg mb-3">New Order</Dialog.Title>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-gray-600">Table No.</label>
            <input className="border rounded px-2 py-1" placeholder="e.g., 4" value={table} onChange={e => setTable(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-gray-600">Menu Item</label>
            <select className="border rounded px-2 py-1" onChange={e => addItem(e.target.value)} defaultValue="">
              <option value="" disabled>Select item</option>
              {menu.map(m => (
                <option key={m.id} value={m.id} disabled={!m.available}>{m.name} — ₹{m.price}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {sel.map(item => (
              <div className="flex items-center justify-between" key={item.id}>
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button className="btn btn-outline" onClick={() => setSel(sel.map(s => s.id === item.id ? { ...s, qty: Math.max(1, s.qty - 1) } : s))}>-</button>
                  <span>{item.qty}</span>
                  <button className="btn btn-outline" onClick={() => setSel(sel.map(s => s.id === item.id ? { ...s, qty: s.qty + 1 } : s))}>+</button>
                  <button className="btn btn-ghost" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm text-gray-600">Total</span>
            <span className="font-semibold">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Dialog.Close asChild>
            <button className="btn btn-outline">Cancel</button>
          </Dialog.Close>
          <button
            className="btn btn-primary"
            onClick={() => onCreate({ table: Number(table || 0), items: sel })}
            disabled={!table || sel.length === 0}
          >
            Create Order
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

function ReservationSection() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('Dine-in')
  const [time, setTime] = useState('')
  const [confirmed, setConfirmed] = useState(null)

  const submit = () => {
    setConfirmed({ name, phone, type, time })
  }

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Online Order + Reservation</h3>
      <div className="grid md:grid-cols-4 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Customer Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <select className="border rounded px-2 py-1" value={type} onChange={e => setType(e.target.value)}>
          <option>Delivery</option>
          <option>Pickup</option>
          <option>Dine-in</option>
        </select>
        <input className="border rounded px-2 py-1" placeholder="Time Slot" value={time} onChange={e => setTime(e.target.value)} />
      </div>
      <div className="mt-3 flex gap-2">
        <button className="btn btn-primary" onClick={submit} disabled={!name || !phone || !time}>Confirm</button>
        {confirmed && (
          <button className="btn btn-outline" onClick={() => alert('WhatsApp Notify (mock)')}>WhatsApp Notify</button>
        )}
      </div>
      {confirmed && (
        <div className="mt-3 border rounded p-3">
          <p className="text-sm text-gray-600">Reservation Confirmed</p>
          <p className="text-sm">{confirmed.name} • {confirmed.phone}</p>
          <p className="text-sm">{confirmed.type} at {confirmed.time}</p>
        </div>
      )}
    </div>
  )
}