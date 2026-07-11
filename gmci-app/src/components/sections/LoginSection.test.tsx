import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginSection } from './LoginSection'

describe('LoginSection', () => {
  it('renders login form', () => {
    render(<LoginSection onLogin={vi.fn()} onForgotPassword={vi.fn()} />)
    expect(screen.getByText('Admin Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('calls onLogin with email and password', async () => {
    const onLogin = vi.fn().mockResolvedValue(true)
    render(<LoginSection onLogin={onLogin} onForgotPassword={vi.fn()} />)

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByText('Login'))

    await waitFor(() =>
      expect(onLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    )
  })

  it('shows error message when login fails', async () => {
    const onLogin = vi.fn().mockResolvedValue(false)
    render(<LoginSection onLogin={onLogin} onForgotPassword={vi.fn()} />)

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByText('Login'))

    await waitFor(() =>
      expect(
        screen.getByText('Login failed. Please check your credentials.')
      ).toBeInTheDocument()
    )
  })

  it('renders forgot password link and switches to forgot password form', async () => {
    const onForgotPassword = vi.fn().mockResolvedValue(true)
    render(<LoginSection onLogin={vi.fn()} onForgotPassword={onForgotPassword} />)

    // Click forgot password link
    fireEvent.click(screen.getByText('Forgot Password?'))
    expect(screen.getByText('Send Reset Link')).toBeInTheDocument()

    // Test forgot password
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link'))

    await waitFor(() =>
      expect(onForgotPassword).toHaveBeenCalledWith('test@example.com')
    )

    // Check success message
    expect(screen.getByText('Password reset email sent! Please check your inbox.')).toBeInTheDocument()
  })
})
