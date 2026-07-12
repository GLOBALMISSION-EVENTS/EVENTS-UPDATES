
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroCarousel } from '@/components/sections/HeroCarousel'
import { EventsSection } from '@/components/sections/EventsSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { useEvents } from '@/hooks/useEvents'
import { useAboutContent } from '@/hooks/useAboutContent'
import type { AboutContent } from '@/types'

export const Home = () => {
  const {
    events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents()

  const { content: aboutContent } = useAboutContent()
  const cmsAboutContent: AboutContent | null = aboutContent ?? null

  return (
    <div className="min-h-screen">
      <header id="home" className="relative bg-dark">
        <Navbar />
        <HeroCarousel />
      </header>

      <main>
        {eventsLoading ? (
          <div className="py-20 text-center">
            <p className="text-xl text-text-light">Loading events...</p>
          </div>
        ) : eventsError ? (
          <section id="events" className="py-20 bg-light-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-center text-text-dark mb-12">Events</h2>
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-xl mx-auto">
                <p className="font-semibold mb-1">Failed to load events</p>
                <p className="text-sm">{eventsError?.message || 'Check the browser console for details.'}</p>
              </div>
            </div>
          </section>
        ) : (
          <EventsSection events={events} />
        )}
        <AboutSection content={cmsAboutContent} />
      </main>

      <Footer />
    </div>
  )
}
