
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroCarousel } from '@/components/sections/HeroCarousel'
import { EventsSection } from '@/components/sections/EventsSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { CMSSection } from '@/components/sections/CMSSection'
import { LoginSection } from '@/components/sections/LoginSection'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'

export const Home = () => {
  const {
    events,
    isLoading: eventsLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    resetEvents,
    exportEvents,
    importEvents,
  } = useEvents()

  const { isLoggedIn, isLoading: authLoading, login, logout } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-text-light">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header id="home" className="relative bg-dark">
        <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
        <HeroCarousel />
      </header>

      <main>
        {eventsLoading ? (
          <div className="py-20 text-center">
            <p className="text-xl text-text-light">Loading events...</p>
          </div>
        ) : (
          <EventsSection events={events} />
        )}
        <AboutSection />
        
        {isLoggedIn ? (
          <CMSSection
            events={events}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            onReorderEvents={reorderEvents}
            onResetEvents={resetEvents}
            onExportEvents={exportEvents}
            onImportEvents={importEvents}
          />
        ) : (
          <LoginSection onLogin={login} />
        )}
      </main>

      <Footer />
    </div>
  )
}
