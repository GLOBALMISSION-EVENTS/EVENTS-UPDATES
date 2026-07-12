import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types'

const INITIAL_EVENTS: Omit<Event, 'id'>[] = [
  {
    position: 1,
    title: 'Mission Impact Breakfast',
    date: '10th July 2026 - 9AM',
    event_date: '2026-07-10',
    venue: 'Y.M.C.A. Hall - Nyeri Town',
    description: 'Join us for a morning of fellowship, prayer, and inspiration as we unite in fundraising for the Great August Harvest, 5th Annual Mega Conference & Medical Camp. Breakfast will be served. Come Hungry - Leave Inspired. Blessed are those who hunger and thirst for righteousness, for they shall be filled. Mat 5:6 (NIV)',
    type: 'upcoming',
    image: '/images/breakfast-poster.png',
  },
  {
    position: 2,
    title: '5th Annual Mega Conference & Free Medical Camp',
    date: '9-16th August 2026 from 9AM',
    event_date: '2026-08-09',
    venue: 'Kiamariga Nursery Grounds',
    description: 'Theme: Healing the Land - Amos 9:14 From Exile to Divine Restoration. All Are Welcome! Featuring: Rev. Anthony Waithaka (Director - GMCI), Archbishop Simon Githiga (Elim Pentecostal Kenya), Bishop Moses Mbugua (Redeemed Gospel Church Thika), Apostle Anthony Ngumo (Reigners Chapel), Rev. James Nyaga (Excellent Glory Center), Bishop Dr. Margaret Wangare (Anointed Christian Fellowship Banana).',
    type: 'upcoming',
    image: '/images/about-us.png',
  },
  {
    position: 3,
    title: 'Conference & Medical Camp @ Kiamariga',
    date: '9th -16th August 2026',
    event_date: '2026-08-09',
    venue: 'Kiamariga',
    description: 'Our 5th Annual Conference & Medical Camp',
    type: 'upcoming',
    image: '/images/kiamariga-camp.jpg',
  },
]

export const useEvents = () => {
  const queryClient = useQueryClient()

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('🔄 Fetching events from database...')
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        console.error('❌ Error fetching events:', error)
        return []
      }

      console.log('📊 Raw events from database:', data)

      // Migration: Add event_date to events that don't have it
      if (data && data.length > 0) {
        const eventsNeedingMigration = data.filter(event => !event.event_date)
        if (eventsNeedingMigration.length > 0) {
          console.log(`🔄 Migrating ${eventsNeedingMigration.length} events to add event_date field`)

          for (const event of eventsNeedingMigration) {
            const dateMatch = event.date?.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/i)
            let eventDate = null
            if (dateMatch) {
              const months: Record<string, string> = {
                january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
                july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
              }
              const day = dateMatch[1].padStart(2, '0')
              const month = months[dateMatch[2].toLowerCase()] || '01'
              eventDate = `${dateMatch[3]}-${month}-${day}`
            }

            if (eventDate) {
              console.log(`🔄 Migrating "${event.title}" to event_date: ${eventDate}`)
              const { error: updateError } = await supabase
                .from('events')
                .update({ event_date: eventDate })
                .eq('id', event.id)

              if (updateError) {
                console.error(`❌ Migration error for "${event.title}":`, updateError)
              } else {
                console.log(`✅ Migrated "${event.title}" successfully`)
                event.event_date = eventDate
              }
            }
          }
        }
      }

      if (!data || data.length === 0) {
        console.log('🌱 Seeding initial events with event_date field')
        const errors: string[] = []
        for (const event of INITIAL_EVENTS) {
          console.log(`🌱 Seeding event: ${event.title} with date: ${event.event_date}`)
          const { error: insertError } = await supabase.from('events').insert(event)
          if (insertError) {
            console.error(`❌ Seeding error for "${event.title}":`, insertError)
            errors.push(insertError.message)
          }
        }
        if (errors.length > 0) {
          console.error('❌ Error seeding events:', errors.join(', '))
        }
        const { data: seeded } = await supabase
          .from('events')
          .select('*')
          .order('position', { ascending: true })
        console.log('🌱 Seeded events:', seeded)
        return await autoCategorizeEvents((seeded || []) as Event[])
      }

      return await autoCategorizeEvents(data as Event[])
    },
    // Refetch every 5 minutes to catch date changes (useful for overnight/weekend changes)
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    // Always refetch when window regains focus to catch date changes
    refetchOnWindowFocus: true,
  })

  const autoCategorizeEvents = async (events: Event[]): Promise<Event[]> => {
    const today = new Date().toISOString().split('T')[0]
    console.log('🔍 Auto-categorization check:', { today, eventsCount: events.length })
    
    const updatedEvents: Event[] = []
    const eventsToUpdate: { id: number; type: 'recent' }[] = []

    // First pass: identify events that need updating and prepare the updated array
    for (const event of events) {
      console.log(`📅 Checking event: "${event.title}" - Date: ${event.event_date} vs Today: ${today}`)
      
      if (event.event_date && event.event_date < today && event.type === 'upcoming') {
        console.log(`✅ Should move to recent: "${event.title}"`)
        // This event should be marked as recent
        eventsToUpdate.push({ id: event.id, type: 'recent' })
        updatedEvents.push({ ...event, type: 'recent' })
      } else {
        console.log(`➡️  Keeping as ${event.type}: "${event.title}"`)
        // Keep event as-is
        updatedEvents.push(event)
      }
    }

    // Batch update all events that need to be changed
    if (eventsToUpdate.length > 0) {
      console.log(`🔄 Updating ${eventsToUpdate.length} events from upcoming to recent`)
      try {
        for (const update of eventsToUpdate) {
          const { error } = await supabase
            .from('events')
            .update({ type: update.type })
            .eq('id', update.id)
          
          if (error) {
            console.error(`❌ Error auto-categorizing event ${update.id}:`, error)
          } else {
            console.log(`✅ Updated event ${update.id} to recent`)
          }
        }
        console.log(`✅ Auto-categorized ${eventsToUpdate.length} events from upcoming to recent`)
      } catch (error) {
        console.error('❌ Error during batch auto-categorization:', error)
      }
    } else {
      console.log('ℹ️  No events need auto-categorization')
    }

    return updatedEvents
  }

  const addEventMutation = useMutation({
    mutationFn: async (newEvent: Omit<Event, 'id'>) => {
      const maxPosition = events.reduce((max, e) => Math.max(max, e.position || 0), 0)
      const { data, error } = await supabase
        .from('events')
        .insert({ ...newEvent, position: maxPosition + 1 })
        .select()
        .single()

      if (error) throw error
      return data as Event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, updatedEvent }: { id: number; updatedEvent: Partial<Event> }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const reorderEventsMutation = useMutation({
    mutationFn: async (newOrder: Event[]) => {
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('events')
          .update({ position: i + 1 })
          .eq('id', newOrder[i].id)
      }
      return newOrder
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const addEvent = (event: Omit<Event, 'id'>) => {
    addEventMutation.mutate(event)
  }

  const updateEvent = (id: number, updatedEvent: Partial<Event>) => {
    updateEventMutation.mutate({ id, updatedEvent })
  }

  const deleteEvent = (id: number) => {
    deleteEventMutation.mutate(id)
  }

  const reorderEvents = (newOrder: Event[]) => {
    reorderEventsMutation.mutate(newOrder)
  }

  const resetEvents = async () => {
    // First delete all events
    await supabase.from('events').delete().neq('id', 0)
    
    // Then insert fresh events with event_date
    for (let i = 0; i < INITIAL_EVENTS.length; i++) {
      const eventData = { ...INITIAL_EVENTS[i], position: i + 1 }
      console.log(`🌱 Inserting fresh event: ${eventData.title} with event_date: ${eventData.event_date}`)
      const { error } = await supabase.from('events').insert(eventData)
      if (error) {
        console.error(`❌ Error inserting ${eventData.title}:`, error)
      }
    }
    
    queryClient.invalidateQueries({ queryKey: ['events'] })
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

  const importEvents = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (Array.isArray(imported)) {
          await supabase.from('events').delete().neq('id', 0)
          for (let i = 0; i < imported.length; i++) {
            await supabase.from('events').insert({ ...imported[i], position: i + 1 })
          }
          queryClient.invalidateQueries({ queryKey: ['events'] })
        }
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    resetEvents,
    exportEvents,
    importEvents,
  }
}