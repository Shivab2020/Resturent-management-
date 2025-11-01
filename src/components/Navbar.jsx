import { Link, NavLink } from 'react-router-dom'
import { Utensils, Gauge, ClipboardList, Package, MessageSquare, Users, HeartHandshake, Moon, Sun, Menu as MenuIcon, Bot, LayoutGrid, QrCode, Star } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import { useEffect, useState } from 'react'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const cls = document.documentElement.classList
    if (dark) cls.add('dark')
    else cls.remove('dark')
  }, [dark])

  // Persist theme across reloads
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setDark(saved === 'dark')
  }, [])
  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const navItem = (
    to,
    label,
    Icon
  ) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isActive ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200'
        }`
      }
    >
      <Icon size={18} /> {label}
    </NavLink>
  )

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden btn btn-ghost" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Utensils className="text-brand-600" />
            <span className="font-semibold text-lg">SmartRestro</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItem('/', 'Dashboard', Gauge)}
          {navItem('/orders', 'Orders', ClipboardList)}
          {navItem('/menu', 'Menu', Utensils)}
          {navItem('/inventory', 'Inventory', Package)}
          {navItem('/feedback', 'Feedback', MessageSquare)}
          {navItem('/staff', 'Staff', Users)}
          {navItem('/crm', 'CRM', HeartHandshake)}
          {navItem('/qr', 'QR Codes', QrCode)}
          {navItem('/tables', 'Tables', LayoutGrid)}
          {navItem('/ai', 'AI Analysis', Bot)}
          {navItem('/reviews', 'Reviews', Star)}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-gray-500" />
            <Switch.Root
              className="w-10 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-brand-500"
              checked={dark}
              onCheckedChange={setDark}
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow absolute left-0.5 top-0.5 transition-transform data-[state=checked]:translate-x-4" />
            </Switch.Root>
            <Moon size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  )
}