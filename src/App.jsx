import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LangProvider } from './context/LangContext'
import { ToastProvider } from './hooks/useToast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Invoices from './pages/dashboard/Invoices'
import InvoiceForm from './pages/dashboard/InvoiceForm'
import Users from './pages/dashboard/Users'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/new" element={<InvoiceForm />} />
              <Route path="invoices/:id/edit" element={<InvoiceForm />} />
              <Route path="users" element={<Users />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </LangProvider>
  )
}
