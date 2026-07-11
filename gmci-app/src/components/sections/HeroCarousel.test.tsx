import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroCarousel } from './HeroCarousel'

describe('HeroCarousel', () => {
  it('renders hero content', () => {
    render(<HeroCarousel />)
    expect(screen.getByText('REVIVE THE NATIONS')).toBeInTheDocument()
    expect(screen.getByText('Preach the Gospel. Win Souls.')).toBeInTheDocument()
  })
})
