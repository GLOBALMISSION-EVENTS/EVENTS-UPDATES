import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from './useAuth'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with isLoading true', async () => {
    const { supabase } = await import('@/lib/supabase')
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    })
    const { result } = renderHook(() => useAuth())
    expect(result.current.isLoading).toBe(true)
  })

  it('sets isLoggedIn to true when there is a session', async () => {
    const { supabase } = await import('@/lib/supabase')
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: {
        user: { id: '1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '2024-01-01' },
        access_token: 'token',
        refresh_token: 'refresh',
        expires_in: 3600,
        token_type: 'bearer',
      } },
      error: null,
    })
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('login returns true on successful login', async () => {
    const { supabase } = await import('@/lib/supabase')
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: { id: '1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '2024-01-01' },
        session: {
          access_token: 'token',
          refresh_token: 'refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: { id: '1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '2024-01-01' },
        },
      },
      error: null,
    })
    const { result } = renderHook(() => useAuth())
    const success = await result.current.login('test@example.com', 'password')
    expect(success).toBe(true)
  })

  it('logout calls signOut', async () => {
    const { supabase } = await import('@/lib/supabase')
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })
    const { result } = renderHook(() => useAuth())
    await result.current.logout()
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })
})
