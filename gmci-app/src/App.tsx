
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home } from './pages/Home'
import { AdminPage } from './pages/AdminPage'
import { LoginPage } from './pages/LoginPage'
import { QRCodeGenerator } from './pages/QRCodeGenerator'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/EVENTS-UPDATES/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/qrcode" element={<QRCodeGenerator />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
