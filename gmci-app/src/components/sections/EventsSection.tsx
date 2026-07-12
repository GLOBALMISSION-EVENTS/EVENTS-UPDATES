import { useState } from 'react'
import { EventCard } from '@/components/shared/EventCard'
import type { Event } from '@/types'

interface EventsSectionProps {
  events: Event[]
}

export const EventsSection = ({ events }: EventsSectionProps) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recent'>('upcoming')



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
