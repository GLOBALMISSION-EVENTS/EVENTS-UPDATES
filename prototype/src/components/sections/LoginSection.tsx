import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LoginSectionProps {
  onLogin: (password: string) => boolean
}

export const LoginSection = ({ onLogin }: LoginSectionProps) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onLogin(password)
    if (!success) {
      setError(true)
      setPassword('')
    }
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
            value="admin@gmci.org"
            disabled
            className="bg-gray-100"
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
          <Button type="submit" size="lg" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </section>
  )
}
