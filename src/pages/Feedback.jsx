import { useState } from 'react'
import data from '../data/mockData.json'
import * as Dialog from '@radix-ui/react-dialog'
import { Lightbulb } from 'lucide-react'

const sentimentEmoji = {
  positive: '😊',
  neutral: '😐',
  negative: '😡'
}

export default function Feedback() {
  const [comments] = useState(data.feedback)
  const positive = Math.round((comments.filter(c => c.sentiment === 'positive').length / comments.length) * 100)
  const neutral = Math.round((comments.filter(c => c.sentiment === 'neutral').length / comments.length) * 100)
  const negative = 100 - positive - neutral
  const [openInsight, setOpenInsight] = useState(false)

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Feedback Analyzer</h2>
        <Dialog.Root open={openInsight} onOpenChange={setOpenInsight}>
          <Dialog.Trigger asChild>
            <button className="btn btn-primary"><Lightbulb size={16}/> AI Insight</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md card p-4">
              <Dialog.Title className="font-semibold text-lg mb-2">AI Suggestions (Mock)</Dialog.Title>
              <p className="text-sm text-gray-600">Customers loved Paneer Butter Masala; Improve service speed.</p>
              <div className="mt-4 flex justify-end">
                <Dialog.Close asChild>
                  <button className="btn btn-outline">Close</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Sentiment Summary</h3>
        <div className="flex items-center gap-4">
          <Bar label={`Positive ${positive}%`} value={positive} color="bg-green-500" />
          <Bar label={`Neutral ${neutral}%`} value={neutral} color="bg-yellow-500" />
          <Bar label={`Negative ${negative}%`} value={negative} color="bg-red-500" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {comments.map((c, i) => (
          <div className="card p-4" key={i}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{c.customer}</span>
              <span className="text-xl">{sentimentEmoji[c.sentiment]}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Bar({ label, value, color }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div className={`h-2 ${color} rounded`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}