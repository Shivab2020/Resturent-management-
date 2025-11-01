import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Menu from './pages/Menu'
import Inventory from './pages/Inventory'
import Feedback from './pages/Feedback'
import Staff from './pages/Staff'
import CRM from './pages/CRM'
import QRManagement from './pages/QRManagement'
import QROrder from './pages/QROrder'
import TableManagement from './pages/TableManagement'
import AIAnalysis from './pages/AIAnalysis'
import Reviews from './pages/Reviews'
import { Toaster } from 'sonner'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/qr" element={<QRManagement />} />
          <Route path="/qr-order" element={<QROrder />} />
          <Route path="/tables" element={<TableManagement />} />
          <Route path="/ai" element={<AIAnalysis />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
