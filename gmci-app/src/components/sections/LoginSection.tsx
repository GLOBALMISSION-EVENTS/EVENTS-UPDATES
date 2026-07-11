import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LoginSectionProps {
  onLogin: (email: string, password: string) => Promise<boolean>
}

export const LoginSection = ({ onLogin }: LoginSectionProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)
    const success = await onLogin(email, password)
    if (!success) {
      setError(true)
      setPassword('')
    }
    setIsLoading(false)
  }

  return (
    <section id="adminLogin" className="py-20 bg-light-bg">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-text-dark mb-4">Admin Login</h2>
        <p className="text-text-light mb-8">
          This area is restricted to authorized administrators only.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(false)
            }}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            required
          />
          {error && (
            <p className="text-red-600 text-sm">Login failed. Please check your credentials.</p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </section>
  )
}
