import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders logo and nav items', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByAltText('GMCI Logo')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
  })

  it('renders admin items when logged in', () => {
    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} onLogout={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('QR Generator')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('opens and closes mobile menu', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    const menuButton = screen.getByLabelText('Open menu')
    fireEvent.click(menuButton)
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', async () => {
    const onLogout = vi.fn()
    render(
      <MemoryRouter>
        <Navbar isLoggedIn={true} onLogout={onLogout} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Logout'))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
