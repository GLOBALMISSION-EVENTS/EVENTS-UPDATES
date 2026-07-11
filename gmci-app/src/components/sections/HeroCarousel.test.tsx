import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroCarousel } from './HeroCarousel'

describe('HeroCarousel', () => {
  it('renders hero content', () => {
    const { container } = render(<HeroCarousel />)
    expect(container.textContent).toContain('REVIVE')
    expect(container.textContent).toContain('NATIONS')
    expect(screen.getByText('Preach the Gospel. Win Souls.')).toBeInTheDocument()
  })
})
