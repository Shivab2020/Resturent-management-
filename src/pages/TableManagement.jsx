import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'

const initialTables = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, seats: 4, status: 'vacant', currentParty: null }))

export default function TableManagement() {
  const [tables, setTables] = useState(initialTables)
  const [openReserve, setOpenReserve] = useState(false)
  const [activeTable, setActiveTable] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' })

  const setStatus = (id, status) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status, currentParty: status === 'occupied' ? (t.currentParty || { name: 'Walk-in', size: t.seats }) : null } : t))
    toast.success(`Table ${id} ${status}`)
  }

  const reserve = (id, payload) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: 'reserved', currentParty: { name: payload.name, phone: payload.phone, date: payload.date, time: payload.time, size: t.seats } } : t))
    toast.success(`Table ${id} reserved for ${payload.name}`)
  }

  const release = (id) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: 'vacant', currentParty: null } : t))
    toast.success(`Table ${id} released`)
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Table Management</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tables.map(t => (
          <div className="card p-4" key={t.id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Table {t.id}</h3>
                <p className="text-xs text-gray-600">Seats: {t.seats}</p>
              </div>
              <span className={`badge ${t.status === 'vacant' ? 'badge-success' : t.status === 'reserved' ? 'badge-warning' : 'badge-error'}`}>{t.status}</span>
            </div>
            {t.currentParty && (
              <div className="mt-2 text-sm space-y-1">
                <p>Party: {t.currentParty.name} ({t.currentParty.size})</p>
                {t.currentParty.phone && <p className="text-xs text-gray-600">Phone: {t.currentParty.phone}</p>}
                {(t.currentParty.date || t.currentParty.time) && <p className="text-xs text-gray-600">{t.currentParty.date} {t.currentParty.time}</p>}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn btn-outline" onClick={() => setStatus(t.id, 'occupied')}>Mark Occupied</button>
              {t.status !== 'reserved' ? (
                <button className="btn btn-outline" onClick={() => { setActiveTable(t.id); setOpenReserve(true) }}>Reserve</button>
              ) : (
                <button className="btn btn-ghost" onClick={() => release(t.id)}>Cancel Reservation</button>
              )}
              <button className="btn btn-ghost" onClick={() => release(t.id)}>Release</button>
            </div>
          </div>
        ))}
      </div>

      <Dialog.Root open={openReserve} onOpenChange={setOpenReserve}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md card p-4">
            <Dialog.Title className="font-semibold text-lg mb-3">Reserve Table {activeTable}</Dialog.Title>
            <div className="grid gap-2">
              <input className="border rounded px-2 py-1" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="border rounded px-2 py-1" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="border rounded px-2 py-1" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <input type="time" className="border rounded px-2 py-1" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button className="btn btn-outline">Cancel</button>
              </Dialog.Close>
              <button className="btn btn-primary" onClick={() => { reserve(activeTable, form); setOpenReserve(false); setForm({ name: '', phone: '', date: '', time: '' }) }} disabled={!form.name || !form.phone || !form.date || !form.time}>Confirm</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}