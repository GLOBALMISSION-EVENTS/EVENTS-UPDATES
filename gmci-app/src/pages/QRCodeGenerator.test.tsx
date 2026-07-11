import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QRCodeGenerator } from './QRCodeGenerator'

// Mock Supabase first
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

vi.mock('qrcode', () => ({
  default: {
    toCanvas: vi.fn(),
    toString: vi.fn(),
  },
}))

describe('QR Code Generator Page', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { supabase } = await import('@/lib/supabase')
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    })
  })
  it('renders QR code generator', () => {
    render(
      <MemoryRouter>
        <QRCodeGenerator />
      </MemoryRouter>
    )
    expect(screen.getByText('QR Code Generator')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument()
    expect(screen.getByText('Download PNG')).toBeInTheDocument()
    expect(screen.getByText('Download SVG')).toBeInTheDocument()
  })
})
