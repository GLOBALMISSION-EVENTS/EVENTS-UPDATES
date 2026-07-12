import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LoginSection } from '@/components/sections/LoginSection'
import { useAuth } from '@/hooks/useAuth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, forgotPassword, isLoggedIn, isLoading, logout } = useAuth()

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password)
    if (success) {
      navigate('/admin', { replace: true })
    }
    return success
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-text-light">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
      <div className="pt-8 pb-20">
        <LoginSection onLogin={handleLogin} onForgotPassword={forgotPassword} />
      </div>
      <Footer />
    </div>
  )
}
