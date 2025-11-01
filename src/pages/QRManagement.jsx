import { useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'

export default function QRManagement() {
  const [tables, setTables] = useState(Array.from({ length: 8 }, (_, i) => i + 1))
  const base = `${window.location.origin}/qr-order?table=`

  const addTable = () => setTables([...tables, (tables[tables.length - 1] || 0) + 1])

  const copyLink = (t) => {
    const url = base + t
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard')
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">QR Code Management</h2>
        <button className="btn btn-primary" onClick={addTable}>Add Table</button>
      </div>

      <p className="text-sm text-gray-600">Generate QR codes for each table so customers can order directly. Each QR encodes a link to the QR Order page with the table number.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((t) => (
          <div className="card p-4" key={t}>
            <h3 className="font-semibold mb-2">Table {t}</h3>
            <div className="bg-white p-4 rounded border inline-block">
              <QRCode value={base + t} size={128} />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn btn-outline" onClick={() => copyLink(t)}>Copy Link</button>
              <button className="btn btn-ghost" onClick={() => window.print()}>Print</button>
            </div>
            <p className="mt-2 text-xs text-gray-500">URL: {base + t}</p>
          </div>
        ))}
      </div>
    </div>
  )
}