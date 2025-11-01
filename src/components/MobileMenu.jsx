import * as Dialog from '@radix-ui/react-dialog'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/orders', label: 'Orders' },
  { to: '/menu', label: 'Menu' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/staff', label: 'Staff' },
  { to: '/crm', label: 'CRM' },
  { to: '/qr', label: 'QR Codes' },
  { to: '/tables', label: 'Tables' },
  { to: '/ai', label: 'AI Analysis' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/qr-order', label: 'QR Order' },
]

export default function MobileMenu({ open, onOpenChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-0 top-0 h-full w-72 card rounded-none p-4">
          <h3 className="font-semibold mb-3">Menu</h3>
          <nav className="grid gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md ${isActive ? 'bg-brand-500 text-white' : 'hover:bg-gray-100 text-gray-800 dark:text-gray-200'}`
                }
                onClick={() => onOpenChange(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4">
            <Dialog.Close asChild>
              <button className="btn btn-outline w-full">Close</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}