import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CMSSection } from '@/components/sections/CMSSection'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { useHeroSlides } from '@/hooks/useHeroSlides'
import { useAboutContent } from '@/hooks/useAboutContent'
import type { AboutContent } from '@/types'

export const AdminPage = () => {
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
  const { isLoggedIn, logout } = useAuth()

  if (eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-text-light">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />

      <div className="pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">CMS Admin</h1>
            <p className="text-text-light mt-2">Manage events, hero slides, about content, and generate QR codes.</p>
          </div>

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
        </div>
      </div>

      <Footer />
    </div>
  )
}
