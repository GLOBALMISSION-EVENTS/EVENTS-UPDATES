import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EventsSection } from './EventsSection'
import type { Event } from '@/types'

const testEvents: Event[] = [
  { id: 1, title: 'Upcoming 1', date: '', venue: '', description: '', type: 'upcoming' },
  { id: 2, title: 'Recent 1', date: '', venue: '', description: '', type: 'recent' },
]

describe('EventsSection', () => {
  it('renders events and tabs', () => {
    render(<EventsSection events={testEvents} />)
    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText('Recent')).toBeInTheDocument()
  })

  it('switches between tabs', () => {
    render(<EventsSection events={testEvents} />)
    fireEvent.click(screen.getByText('Recent'))
    expect(screen.getByText('Recent 1')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Upcoming'))
    expect(screen.getByText('Upcoming 1')).toBeInTheDocument()
  })

  it('shows no events message when there are none', () => {
    render(<EventsSection events={[]} />)
    expect(screen.getByText(/No upcoming events found./)).toBeInTheDocument()
  })
})
