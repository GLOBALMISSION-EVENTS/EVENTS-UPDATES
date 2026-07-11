
import { Card, CardContent } from '@/components/ui/card'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="relative h-56 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-primary flex items-center justify-center text-4xl">
            ✝️
          </div>
        )}
      </div>
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold text-text-dark mb-3">{event.title}</h3>
        <p className="text-secondary font-semibold mb-2 flex items-center gap-2">
          📅 {event.date}
        </p>
        <p className="text-primary font-semibold mb-3 flex items-center gap-2">
          📍 {event.venue}
        </p>
        <p className="text-text-light line-clamp-3">{event.description}</p>
      </CardContent>
    </Card>
  )
}
