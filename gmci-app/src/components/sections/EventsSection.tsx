import { useState } from 'react'
import { EventCard } from '@/components/shared/EventCard'
import type { Event } from '@/types'

interface EventsSectionProps {
  events: Event[]
}

export const EventsSection = ({ events }: EventsSectionProps) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recent'>('upcoming')

  // Debug function to reset and re-categorize
  const handleDebugRecategorize = async () => {
    console.log('🔄 Manual reset and re-categorization triggered')
    
    // Direct database reset with proper event_date
    try {
      console.log('🗑️ Deleting all existing events...')
      await fetch('https://yxrkpxehqzbaunznvqii.supabase.co/rest/v1/events?id=neq.0', {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtweGVocXpiYXVuem52cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTE2MDAsImV4cCI6MjA1MjM2NzYwMH0.vAdBlbwNSwQ5VijB03zLbA_EcQ8KlbH',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtweGVocXpiYXVuem52cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTE2MDAsImV4cCI6MjA1MjM2NzYwMH0.vAdBlbwNSwQ5VijB03zLbA_EcQ8KlbH',
        }
      })
      
      console.log('🌱 Inserting events with proper event_date...')
      const eventsToInsert = [
        {
          position: 1,
          title: 'Mission Impact Breakfast',
          date: '10th July 2026 - 9AM',
          event_date: '2026-07-10',
          venue: 'Y.M.C.A. Hall - Nyeri Town',
          description: 'Join us for a morning of fellowship, prayer, and inspiration as we unite in fundraising for the Great August Harvest, 5th Annual Mega Conference & Medical Camp.',
          type: 'upcoming',
          image: '/images/breakfast-poster.png',
        },
        {
          position: 2,
          title: '5th Annual Mega Conference & Free Medical Camp',
          date: '9-16th August 2026 from 9AM',
          event_date: '2026-08-09',
          venue: 'Kiamariga Nursery Grounds',
          description: 'Theme: Healing the Land - Amos 9:14 From Exile to Divine Restoration.',
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
      
      for (const event of eventsToInsert) {
        console.log(`🌱 Inserting: ${event.title} with date: ${event.event_date}`)
        await fetch('https://yxrkpxehqzbaunznvqii.supabase.co/rest/v1/events', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtweGVocXpiYXVuem52cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTE2MDAsImV4cCI6MjA1MjM2NzYwMH0.vAdBlbwNSwQ5VijB03zLbA_EcQ8KlbH',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtweGVocXpiYXVuem52cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTE2MDAsImV4cCI6MjA1MjM2NzYwMH0.vAdBlbwNSwQ5VijB03zLbA_EcQ8KlbH',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
        })
      }
      
      console.log('✅ Reset complete! Reloading page...')
      setTimeout(() => window.location.reload(), 1000)
      
    } catch (error) {
      console.error('❌ Reset failed:', error)
    }
  }

  const filteredEvents = events.filter(
    (event) => event.type?.toLowerCase() === activeTab
  )

  return (
    <section id="events" className="py-20 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-text-dark mb-12">
          Events
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'upcoming'
                ? 'bg-secondary text-white shadow-lg'
                : 'bg-white text-text-dark hover:bg-gray-100'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'recent'
                ? 'bg-secondary text-white shadow-lg'
                : 'bg-white text-text-dark hover:bg-gray-100'
            }`}
          >
            Recent
          </button>
        </div>

        {/* Debug button - remove after fixing */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleDebugRecategorize}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            🔄 Reset Database & Fix Auto-categorization
          </button>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-light text-xl">No {activeTab} events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
