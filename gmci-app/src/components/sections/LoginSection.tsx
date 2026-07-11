import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LoginSectionProps {
  onLogin: (email: string, password: string) => Promise<boolean>
  onForgotPassword: (email: string) => Promise<boolean>
}

export const LoginSection = ({ onLogin, onForgotPassword }: LoginSectionProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)
    const success = await onForgotPassword(email)
    if (success) {
      setForgotPasswordSuccess(true)
    } else {
      setError(true)
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
        {forgotPasswordSuccess ? (
          <div className="space-y-4">
            <p className="text-green-600">
              Password reset email sent! Please check your inbox.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForgotPassword(false)
                setForgotPasswordSuccess(false)
              }}
            >
              Back to Login
            </Button>
          </div>
        ) : showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
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
            {error && (
              <p className="text-red-600 text-sm">
                Failed to send reset email. Please check your email address.
              </p>
            )}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForgotPassword(false)}
              >
                Back
              </Button>
            </div>
          </form>
        ) : (
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
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
