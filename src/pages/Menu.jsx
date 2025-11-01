import { useState } from 'react'
import data from '../data/mockData.json'
import * as Switch from '@radix-ui/react-switch'

export default function Menu() {
  const [items, setItems] = useState(data.menu)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')

  const addItem = () => {
    const id = Math.max(...items.map(i => i.id)) + 1
    setItems([{ id, name, category, price: Number(price || 0), available: true }, ...items])
    setName(''); setCategory(''); setPrice('')
  }

  const toggleAvailability = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, available: !i.available } : i))
  }

  const updatePrice = (id, value) => setItems(items.map(i => i.id === id ? { ...i, price: Number(value || 0) } : i))

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Menu</h2>

      <div className="card p-4">
        <div className="grid sm:grid-cols-4 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          <button className="btn btn-primary" onClick={addItem} disabled={!name || !category || !price}>Add New Item</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div className="card p-4" key={item.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
              </div>
              <span className={`badge ${item.available ? 'badge-green' : 'badge-red'}`}>{item.available ? 'Available' : 'Out of Stock'}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Price</span>
                <input className="border rounded px-2 py-1 w-24" type="number" value={item.price} onChange={e => updatePrice(item.id, e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Availability</span>
                <Switch.Root
                  checked={item.available}
                  onCheckedChange={() => toggleAvailability(item.id)}
                  className="w-10 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-brand-500"
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow absolute left-0.5 top-0.5 transition-transform data-[state=checked]:translate-x-4" />
                </Switch.Root>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}