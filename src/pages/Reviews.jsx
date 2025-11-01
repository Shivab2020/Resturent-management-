import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const initialReviews = [
  { id: 1, name: 'Aditi', rating: 5, comment: 'Loved the paneer tikka!', date: '2025-10-01' },
  { id: 2, name: 'Rahul', rating: 4, comment: 'Quick service, biryani was great.', date: '2025-10-03' },
  { id: 3, name: 'Sara', rating: 3, comment: 'Good taste but a bit spicy.', date: '2025-10-05' }
]

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews)
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })

  const summary = useMemo(() => {
    const total = reviews.length
    const avg = total ? (reviews.reduce((s,r) => s + r.rating, 0) / total).toFixed(1) : 0
    const dist = [1,2,3,4,5].map(r => ({ r, c: reviews.filter(rv => rv.rating === r).length }))
    return { total, avg, dist }
  }, [reviews])

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.comment) return toast.error('Fill all fields')
    setReviews([{ id: Date.now(), name: form.name, rating: Number(form.rating), comment: form.comment, date: new Date().toISOString().slice(0,10) }, ...reviews])
    setForm({ name: '', rating: 5, comment: '' })
    toast.success('Review submitted (mock)')
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="text-sm text-gray-600">Average rating: <span className="font-semibold">{summary.avg}</span> ({summary.total} reviews)</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Add Review</h3>
          <form className="grid gap-2" onSubmit={submit}>
            <input className="border rounded px-2 py-1" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <select className="border rounded px-2 py-1" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
            </select>
            <textarea className="border rounded px-2 py-1" placeholder="Write your feedback" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Distribution</h3>
          <ul className="space-y-1">
            {summary.dist.map(d => (
              <li key={d.r} className="flex justify-between"><span>{d.r} stars</span><span>{d.c}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">Recent Reviews</h3>
        <ul className="space-y-2">
          {reviews.map(rv => (
            <li key={rv.id} className="border rounded p-2">
              <div className="flex justify-between">
                <span className="font-medium">{rv.name}</span>
                <span className="text-sm text-gray-500">{rv.date}</span>
              </div>
              <div className="text-yellow-500">{'★'.repeat(rv.rating)}{'☆'.repeat(5 - rv.rating)}</div>
              <p className="text-sm mt-1">{rv.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}