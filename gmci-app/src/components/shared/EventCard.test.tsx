import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventCard } from './EventCard'
import type { Event } from '@/types'

const testEvent: Event = {
  id: 1,
  position: 1,
  title: 'Test Event',
  date: 'July 15, 2026',
  venue: 'Test Venue',
  description: 'Test event description',
  type: 'upcoming',
}

describe('EventCard', () => {
  it('renders event details', () => {
    render(<EventCard event={testEvent} />)
    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('📅 July 15, 2026')).toBeInTheDocument()
    expect(screen.getByText('📍 Test Venue')).toBeInTheDocument()
    expect(screen.getByText('Test event description')).toBeInTheDocument()
  })

  it('renders fallback image when no image is provided', () => {
    render(<EventCard event={testEvent} />)
    expect(screen.getByText('✝️')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(<EventCard event={{ ...testEvent, image: 'test-image.jpg' }} />)
    expect(screen.getByAltText('Test Event')).toHaveAttribute('src', '/test-image.jpg')
  })
})
