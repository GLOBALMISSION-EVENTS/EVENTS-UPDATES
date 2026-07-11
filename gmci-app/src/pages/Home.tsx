
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroCarousel } from '@/components/sections/HeroCarousel'
import { EventsSection } from '@/components/sections/EventsSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { CMSSection } from '@/components/sections/CMSSection'
import { LoginSection } from '@/components/sections/LoginSection'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { useHeroSlides } from '@/hooks/useHeroSlides'
import { useAboutContent } from '@/hooks/useAboutContent'
import type { AboutContent } from '@/types'

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

  const { slides, addSlide, updateSlide, deleteSlide, reorderSlides } = useHeroSlides()

  const { content: aboutContent, updateContent } = useAboutContent()
  const cmsAboutContent: AboutContent | null = aboutContent ?? null

  const { isLoggedIn, isLoading: authLoading, login, forgotPassword, logout } = useAuth()

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
        <HeroCarousel slides={slides} />
      </header>

      <main>
        {eventsLoading ? (
          <div className="py-20 text-center">
            <p className="text-xl text-text-light">Loading events...</p>
          </div>
        ) : (
          <EventsSection events={events} />
        )}
        <AboutSection content={cmsAboutContent} />
        
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
            heroSlides={slides}
            onAddSlide={addSlide}
            onUpdateSlide={updateSlide}
            onDeleteSlide={deleteSlide}
            onReorderSlides={reorderSlides}
            aboutContent={cmsAboutContent}
            onUpdateAboutContent={updateContent}
          />
        ) : (
          <LoginSection onLogin={login} onForgotPassword={forgotPassword} />
        )}
      </main>

      <Footer />
    </div>
  )
}
