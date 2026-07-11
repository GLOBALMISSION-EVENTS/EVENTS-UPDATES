
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home } from './pages/Home'
import { QRCodeGenerator } from './pages/QRCodeGenerator'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qrcode" element={<QRCodeGenerator />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
