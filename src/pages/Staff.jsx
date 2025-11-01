import { useState } from 'react'
import data from '../data/mockData.json'
import * as Dialog from '@radix-ui/react-dialog'

export default function Staff() {
  const [staff, setStaff] = useState(data.staff)
  const [openAdd, setOpenAdd] = useState(false)

  const togglePresent = (idx) => {
    const next = [...staff]
    next[idx].present = !next[idx].present
    setStaff(next)
  }

  const addStaff = ({ name, role, hours }) => {
    setStaff([{ name, role, hours: Number(hours || 0), present: true }, ...staff])
    setOpenAdd(false)
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Staff & Attendance</h2>
        <Dialog.Root open={openAdd} onOpenChange={setOpenAdd}>
          <Dialog.Trigger asChild>
            <button className="btn btn-primary">Add Staff</button>
          </Dialog.Trigger>
          <AddStaffDialog onCreate={addStaff} />
        </Dialog.Root>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 text-sm font-semibold">Name</th>
              <th className="p-3 text-sm font-semibold">Role</th>
              <th className="p-3 text-sm font-semibold">Hours Worked</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.role}</td>
                <td className="p-3">{s.hours}</td>
                <td className="p-3"><span className={`badge ${s.present ? 'badge-green' : 'badge-red'}`}>{s.present ? 'Present' : 'Absent'}</span></td>
                <td className="p-3"><button className="btn btn-outline" onClick={() => togglePresent(idx)}>{s.present ? 'Mark Absent' : 'Mark Present'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AddStaffDialog({ onCreate }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [hours, setHours] = useState('')
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md card p-4">
        <Dialog.Title className="font-semibold text-lg mb-3">Add Staff</Dialog.Title>
        <div className="space-y-3">
          <input className="border rounded px-2 py-1 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded px-2 py-1 w-full" placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
          <input className="border rounded px-2 py-1 w-full" placeholder="Hours Worked" type="number" value={hours} onChange={e => setHours(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Dialog.Close asChild>
            <button className="btn btn-outline">Cancel</button>
          </Dialog.Close>
          <button className="btn btn-primary" onClick={() => onCreate({ name, role, hours })} disabled={!name || !role || !hours}>Save</button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}