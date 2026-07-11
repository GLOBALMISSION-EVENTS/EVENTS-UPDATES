import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutSection } from './AboutSection'

describe('AboutSection', () => {
  it('renders about us content', () => {
    render(<AboutSection />)
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Vision')).toBeInTheDocument()
    expect(screen.getByText('Mission')).toBeInTheDocument()
    expect(screen.getByText('Our Values')).toBeInTheDocument()
    expect(screen.getByText("Director's Message")).toBeInTheDocument()
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
  })
})
