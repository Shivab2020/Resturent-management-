import * as Dialog from '@radix-ui/react-dialog'

export default function InvoiceModal({ open, onOpenChange, order }) {
  const subtotal = order?.items.reduce((s, it) => s + it.qty * it.price, 0) || 0
  const taxes = Math.round(subtotal * 0.05)
  const discount = subtotal > 1000 ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + taxes - discount

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md card p-4">
          <Dialog.Title className="font-semibold text-lg mb-3">Invoice</Dialog.Title>
          {order ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">Order #{order.id} • Table {order.table}</p>
              <div className="space-y-2 mb-4">
                {order.items.map((it, idx) => (
                  <div className="flex justify-between text-sm" key={idx}>
                    <span>
                      {it.name} × {it.qty}
                    </span>
                    <span>₹{(it.qty * it.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 space-y-1 text-sm">
                <Row label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />
                <Row label="Taxes (5%)" value={`₹${taxes.toLocaleString()}`} />
                {discount > 0 && <Row label="Discount (10%)" value={`- ₹${discount.toLocaleString()}`} />}
                <div className="flex justify-between font-semibold pt-2">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No order selected</p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="btn btn-outline">Close</button>
            </Dialog.Close>
            <button className="btn btn-primary">Download PDF (mock)</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  )
}