import { useState, useEffect } from 'react'
import type { Event } from '@/types'

const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Mission Impact Breakfast',
    date: '10th July 2026 - 9AM',
    venue: 'Y.M.C.A. Hall - Nyeri Town',
    description: 'Join us for a morning of fellowship, prayer, and inspiration as we unite in fundraising for the Great August Harvest, 5th Annual Mega Conference & Medical Camp. Breakfast will be served. Come Hungry - Leave Inspired. Blessed are those who hunger and thirst for righteousness, for they shall be filled. Mat 5:6 (NIV)',
    type: 'upcoming',
    image: '/images/breakfast-poster.png',
  },
  {
    id: 2,
    title: '5th Annual Mega Conference & Free Medical Camp',
    date: '9-16th August 2026 from 9AM',
    venue: 'Kiamariga Nursery Grounds',
    description: 'Theme: Healing the Land - Amos 9:14 From Exile to Divine Restoration. All Are Welcome! Featuring: Rev. Anthony Waithaka (Director - GMCI), Archbishop Simon Githiga (Elim Pentecostal Kenya), Bishop Moses Mbugua (Redeemed Gospel Church Thika), Apostle Anthony Ngumo (Reigners Chapel), Rev. James Nyaga (Excellent Glory Center), Bishop Dr. Margaret Wangare (Anointed Christian Fellowship Banana).',
    type: 'upcoming',
    image: '/images/about-us.png',
  },
  {
    id: 3,
    title: 'Conference & Medical Camp @ Kiamariga',
    date: '9th -16th August 2026',
    venue: 'Kiamariga',
    description: 'Our 5th Annual Conference & Medical Camp',
    type: 'upcoming',
    image: '/images/kiamariga-camp.jpg',
  },
]

const STORAGE_KEY = 'gmci_events'

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch {
        // Fallback to initial events
      }
    }
    return INITIAL_EVENTS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now(),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: number, updatedEvent: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event))
    )
  }

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const reorderEvents = (newOrder: Event[]) => {
    setEvents(newOrder)
  }

  const resetEvents = () => {
    setEvents(INITIAL_EVENTS)
  }

  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gmci-events.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importEvents = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (Array.isArray(imported)) {
          setEvents(imported)
        }
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    resetEvents,
    exportEvents,
    importEvents,
  }
}
