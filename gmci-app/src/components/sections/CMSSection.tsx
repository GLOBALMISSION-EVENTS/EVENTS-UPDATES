import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Edit2, Trash2, Plus, Download, Upload, RotateCcw, Save, Image, QrCode, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Sortable from 'sortablejs'
import QRCode from 'qrcode'
import type { Event, HeroSlide, AboutContent } from '@/types'

type CMSTab = 'events' | 'hero' | 'about' | 'qrcode'

interface CMSSectionProps {
  events: Event[]
  onAddEvent: (event: Omit<Event, 'id'>) => void
  onUpdateEvent: (id: number, event: Partial<Event>) => void
  onDeleteEvent: (id: number) => void
  onReorderEvents: (newOrder: Event[]) => void
  onResetEvents: () => void
  onExportEvents: () => void
  onImportEvents: (file: File) => void
  heroSlides: HeroSlide[]
  onAddSlide: (slide: Omit<HeroSlide, 'id'>) => void
  onUpdateSlide: (slide: HeroSlide) => void
  onDeleteSlide: (id: number) => void
  onReorderSlides: (newOrder: HeroSlide[]) => void
  aboutContent: AboutContent | null
  onUpdateAboutContent: (content: Partial<AboutContent>) => void
}

export const CMSSection = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onReorderEvents,
  onResetEvents,
  onExportEvents,
  onImportEvents,
  heroSlides,
  onAddSlide,
  onUpdateSlide,
  onDeleteSlide,
  onReorderSlides,
  aboutContent,
  onUpdateAboutContent,
}: CMSSectionProps) => {
  const [activeTab, setActiveTab] = useState<CMSTab>('events')

  return (
    <section id="cms" className="py-20 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-text-dark text-center mb-4">
          Content Management System
        </h2>
        <p className="text-text-light text-center mb-8 text-lg">
          Manage all your site content from one place
        </p>

        <div className="flex flex-wrap gap-2 mb-8 justify-center border-b border-gray-200 pb-4">
          {[
            { id: 'events' as CMSTab, label: 'Events', icon: FileText },
            { id: 'hero' as CMSTab, label: 'Hero Slides', icon: Image },
            { id: 'about' as CMSTab, label: 'About Content', icon: FileText },
            { id: 'qrcode' as CMSTab, label: 'QR Generator', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-text-dark hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'events' && (
          <EventsTab
            events={events}
            onAddEvent={onAddEvent}
            onUpdateEvent={onUpdateEvent}
            onDeleteEvent={onDeleteEvent}
            onReorderEvents={onReorderEvents}
            onResetEvents={onResetEvents}
            onExportEvents={onExportEvents}
            onImportEvents={onImportEvents}
          />
        )}
        {activeTab === 'hero' && (
          <HeroTab
            slides={heroSlides}
            onAddSlide={onAddSlide}
            onUpdateSlide={onUpdateSlide}
            onDeleteSlide={onDeleteSlide}
            onReorderSlides={onReorderSlides}
          />
        )}
        {activeTab === 'about' && (
          <AboutTab
            content={aboutContent}
            onUpdateContent={onUpdateAboutContent}
          />
        )}
        {activeTab === 'qrcode' && <QRCodeTab />}
      </div>
    </section>
  )
}

const defaultFormData = {
  position: 0,
  title: '',
  date: '',
  venue: '',
  description: '',
  type: 'upcoming' as 'upcoming' | 'recent',
  image: '',
}

interface EventsTabProps {
  events: Event[]
  onAddEvent: (event: Omit<Event, 'id'>) => void
  onUpdateEvent: (id: number, event: Partial<Event>) => void
  onDeleteEvent: (id: number) => void
  onReorderEvents: (newOrder: Event[]) => void
  onResetEvents: () => void
  onExportEvents: () => void
  onImportEvents: (file: File) => void
}

const EventsTab = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onReorderEvents,
  onResetEvents,
  onExportEvents,
  onImportEvents,
}: EventsTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState(defaultFormData)
  const [selectedImageFile, setSelectedImageFile] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (gridRef.current) {
      const sortable = Sortable.create(gridRef.current, {
        animation: 150,
        ghostClass: 'opacity-50',
        onEnd: (evt) => {
          const newOrder = [...events]
          const [movedItem] = newOrder.splice(evt.oldIndex!, 1)
          newOrder.splice(evt.newIndex!, 0, movedItem)
          onReorderEvents(newOrder)
        },
      })
      return () => sortable.destroy()
    }
  }, [events, onReorderEvents])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.date.trim()) newErrors.date = 'Date is required'
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
        position: event.position,
        title: event.title,
        date: event.date,
        venue: event.venue,
        description: event.description,
        type: event.type,
        image: event.image || '',
      })
      setSelectedImageFile(event.image || null)
    } else {
      setEditingEvent(null)
      setFormData(defaultFormData)
      setSelectedImageFile(null)
    }
    setErrors({})
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
    setFormData(defaultFormData)
    setSelectedImageFile(null)
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const eventData = {
      ...formData,
      position: editingEvent ? editingEvent.position : events.length + 1,
      image: selectedImageFile || formData.image,
    }
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData)
    } else {
      onAddEvent(eventData)
    }
    handleCloseModal()
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImageFile(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImportEvents(file)
    }
  }

  return (
    <>
      <p className="text-text-light text-center mb-8 text-lg">
        Easily manage your events with drag-and-drop simplicity
      </p>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Add New Event
        </Button>
        <Button variant="warning" onClick={onExportEvents}>
          <Download className="w-5 h-5 mr-2" />
          Export Data
        </Button>
        <Button variant="secondary" onClick={handleImportClick}>
          <Upload className="w-5 h-5 mr-2" />
          Import Data
        </Button>
        <Button variant="danger" onClick={onResetEvents}>
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset to Default
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
            onKeyDown={(e) => { if (e.key === 'Escape') setDeleteConfirmId(null) }}
            role="button"
            tabIndex={0}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <h3 className="text-2xl font-bold text-text-dark mb-4">Confirm Delete</h3>
            <p className="text-text-light mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="danger"
                onClick={() => {
                  onDeleteEvent(deleteConfirmId)
                  setDeleteConfirmId(null)
                }}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {events.map((event) => (
          <div
            key={event.id}
            data-id={event.id}
            className="bg-white rounded-xl p-6 shadow-lg cursor-move hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-text-dark flex-1 mr-4">
                {event.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(event)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-text-light mb-3">{event.date}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                event.type === 'upcoming'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {event.type}
            </span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cms-event-title" className="block text-sm font-semibold text-text-dark mb-2">
              Event Title
            </label>
            <Input
              id="cms-event-title"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }))
                setErrors((prev) => ({ ...prev, title: '' }))
              }}
              required
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="cms-event-date" className="block text-sm font-semibold text-text-dark mb-2">
              Date
            </label>
            <Input
              id="cms-event-date"
              value={formData.date}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, date: e.target.value }))
                setErrors((prev) => ({ ...prev, date: '' }))
              }}
              placeholder="e.g., 10th July 2026 - 9AM"
              required
            />
            {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="cms-event-venue" className="block text-sm font-semibold text-text-dark mb-2">
              Venue
            </label>
            <Input
              id="cms-event-venue"
              value={formData.venue}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, venue: e.target.value }))
                setErrors((prev) => ({ ...prev, venue: '' }))
              }}
              placeholder="e.g., Y.M.C.A. Hall - Nyeri Town"
              required
            />
            {errors.venue && <p className="text-red-600 text-sm mt-1">{errors.venue}</p>}
          </div>

          <div>
            <label htmlFor="cms-event-description" className="block text-sm font-semibold text-text-dark mb-2">
              Description
            </label>
            <Textarea
              id="cms-event-description"
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, description: e.target.value }))
                setErrors((prev) => ({ ...prev, description: '' }))
              }}
              required
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="cms-event-type" className="block text-sm font-semibold text-text-dark mb-2">
              Event Type
            </label>
            <select
              id="cms-event-type"
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as 'upcoming' | 'recent',
                }))
              }
              className="w-full h-12 rounded-lg border-2 border-primary/30 px-4 text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="upcoming">Upcoming</option>
              <option value="recent">Recent</option>
            </select>
          </div>

          <div>
            <label htmlFor="cms-event-image-file" className="block text-sm font-semibold text-text-dark mb-2">
              Upload Image from Computer
            </label>
            <Input
              id="cms-event-image-file"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
            />
            {selectedImageFile && (
              <div className="mt-3 max-h-40 overflow-hidden rounded-lg">
                <img
                  src={selectedImageFile}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="cms-event-image-url" className="block text-sm font-semibold text-text-dark mb-2">
              OR Image Path/URL (optional)
            </label>
            <Input
              id="cms-event-image-url"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              placeholder="e.g., images/poster.jpg or https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-5 h-5 mr-2" />
              {editingEvent ? 'Update Event' : 'Save Event'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

interface HeroTabProps {
  slides: HeroSlide[]
  onAddSlide: (slide: Omit<HeroSlide, 'id'>) => void
  onUpdateSlide: (slide: HeroSlide) => void
  onDeleteSlide: (id: number) => void
  onReorderSlides: (newOrder: HeroSlide[]) => void
}

const HeroTab = ({
  slides,
  onAddSlide,
  onUpdateSlide,
  onDeleteSlide,
  onReorderSlides,
}: HeroTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState({ image: '', alt: '', position: 1 })
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (gridRef.current) {
      const sortable = Sortable.create(gridRef.current, {
        animation: 150,
        ghostClass: 'opacity-50',
        onEnd: (evt) => {
          const newOrder = [...slides]
          const [movedItem] = newOrder.splice(evt.oldIndex!, 1)
          newOrder.splice(evt.newIndex!, 0, movedItem)
          onReorderSlides(newOrder)
        },
      })
      return () => sortable.destroy()
    }
  }, [slides, onReorderSlides])

  const handleOpenModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide)
      setFormData({ image: slide.image, alt: slide.alt, position: slide.position })
    } else {
      setEditingSlide(null)
      setFormData({ image: '', alt: '', position: slides.length + 1 })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image.trim() || !formData.alt.trim()) return
    if (editingSlide) {
      onUpdateSlide({ ...editingSlide, ...formData })
    } else {
      onAddSlide(formData)
    }
    setIsModalOpen(false)
    setEditingSlide(null)
    setFormData({ image: '', alt: '', position: 1 })
  }

  return (
    <>
      <p className="text-text-light text-center mb-8 text-lg">
        Manage hero carousel slides
      </p>

      <div className="flex gap-4 mb-8 justify-center">
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Add New Slide
        </Button>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
            onKeyDown={(e) => { if (e.key === 'Escape') setDeleteConfirmId(null) }}
            role="button"
            tabIndex={0}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <h3 className="text-2xl font-bold text-text-dark mb-4">Confirm Delete</h3>
            <p className="text-text-light mb-6">Are you sure you want to delete this slide?</p>
            <div className="flex gap-4 justify-center">
              <Button variant="danger" onClick={() => { onDeleteSlide(deleteConfirmId); setDeleteConfirmId(null) }}>
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            data-id={slide.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg cursor-move hover:shadow-xl transition-shadow"
          >
            <div className="h-40 bg-gray-100">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-text-dark">{slide.alt}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleOpenModal(slide)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(slide.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSlide(null) }}
        title={editingSlide ? 'Edit Slide' : 'Add New Slide'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="hero-image" className="block text-sm font-semibold text-text-dark mb-2">Image Path/URL</label>
            <Input
              id="hero-image"
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="e.g., /images/hero/slide1.jpg"
              required
            />
          </div>
          <div>
            <label htmlFor="hero-alt" className="block text-sm font-semibold text-text-dark mb-2">Alt Text</label>
            <Input
              id="hero-alt"
              value={formData.alt}
              onChange={(e) => setFormData((prev) => ({ ...prev, alt: e.target.value }))}
              placeholder="e.g., Worship Service"
              required
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-5 h-5 mr-2" />
              {editingSlide ? 'Update Slide' : 'Save Slide'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setEditingSlide(null) }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

interface AboutTabProps {
  content: AboutContent | null
  onUpdateContent: (content: Partial<AboutContent>) => void
}

const AboutTab = ({ content, onUpdateContent }: AboutTabProps) => {
  const [formData, setFormData] = useState(() => ({
    vision: content?.vision || '',
    mission: content?.mission || '',
    values: (content?.values || []).join('\n'),
    directorName: content?.directorName || '',
    directorTitle: content?.directorTitle || '',
    directorImage: content?.directorImage || '',
    directorMessage: (content?.directorMessage || []).join('\n\n'),
    aboutImage: content?.aboutImage || '',
    contactPhone: (content?.contactPhone || []).join(', '),
    contactEmail: (content?.contactEmail || []).join(', '),
    contactTwitter: content?.contactTwitter || '',
    contactYoutube: content?.contactYoutube || '',
    contactAddress: (content?.contactAddress || []).join(', '),
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateContent({
      vision: formData.vision,
      mission: formData.mission,
      values: formData.values.split('\n').filter((v) => v.trim()),
      directorName: formData.directorName,
      directorTitle: formData.directorTitle,
      directorImage: formData.directorImage,
      directorMessage: formData.directorMessage.split('\n\n').filter((v) => v.trim()),
      aboutImage: formData.aboutImage,
      contactPhone: formData.contactPhone.split(',').map((v) => v.trim()).filter((v) => v),
      contactEmail: formData.contactEmail.split(',').map((v) => v.trim()).filter((v) => v),
      contactTwitter: formData.contactTwitter,
      contactYoutube: formData.contactYoutube,
      contactAddress: formData.contactAddress.split(',').map((v) => v.trim()).filter((v) => v),
    })
  }

  return (
    <>
      <p className="text-text-light text-center mb-8 text-lg">
        Edit the About section content
      </p>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-8 shadow-lg">
          <div>
            <label htmlFor="about-vision" className="block text-sm font-semibold text-text-dark mb-2">Vision</label>
            <Textarea id="about-vision" value={formData.vision} onChange={(e) => setFormData((prev) => ({ ...prev, vision: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-mission" className="block text-sm font-semibold text-text-dark mb-2">Mission</label>
            <Textarea id="about-mission" value={formData.mission} onChange={(e) => setFormData((prev) => ({ ...prev, mission: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-values" className="block text-sm font-semibold text-text-dark mb-2">Values (one per line)</label>
            <Textarea id="about-values" value={formData.values} onChange={(e) => setFormData((prev) => ({ ...prev, values: e.target.value }))} rows={5} />
          </div>
          <div>
            <label htmlFor="about-director-name" className="block text-sm font-semibold text-text-dark mb-2">Director Name</label>
            <Input id="about-director-name" value={formData.directorName} onChange={(e) => setFormData((prev) => ({ ...prev, directorName: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-director-title" className="block text-sm font-semibold text-text-dark mb-2">Director Title</label>
            <Input id="about-director-title" value={formData.directorTitle} onChange={(e) => setFormData((prev) => ({ ...prev, directorTitle: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-director-image" className="block text-sm font-semibold text-text-dark mb-2">Director Image Path</label>
            <Input id="about-director-image" value={formData.directorImage} onChange={(e) => setFormData((prev) => ({ ...prev, directorImage: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-director-message" className="block text-sm font-semibold text-text-dark mb-2">Director Message (paragraphs separated by blank line)</label>
            <Textarea id="about-director-message" value={formData.directorMessage} onChange={(e) => setFormData((prev) => ({ ...prev, directorMessage: e.target.value }))} rows={6} />
          </div>
          <div>
            <label htmlFor="about-image" className="block text-sm font-semibold text-text-dark mb-2">About Image Path</label>
            <Input id="about-image" value={formData.aboutImage} onChange={(e) => setFormData((prev) => ({ ...prev, aboutImage: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-contact-phone" className="block text-sm font-semibold text-text-dark mb-2">Contact Phone (comma separated)</label>
            <Input id="about-contact-phone" value={formData.contactPhone} onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-contact-email" className="block text-sm font-semibold text-text-dark mb-2">Contact Email (comma separated)</label>
            <Input id="about-contact-email" value={formData.contactEmail} onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-twitter" className="block text-sm font-semibold text-text-dark mb-2">Twitter Handle</label>
            <Input id="about-twitter" value={formData.contactTwitter} onChange={(e) => setFormData((prev) => ({ ...prev, contactTwitter: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-youtube" className="block text-sm font-semibold text-text-dark mb-2">YouTube</label>
            <Input id="about-youtube" value={formData.contactYoutube} onChange={(e) => setFormData((prev) => ({ ...prev, contactYoutube: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="about-contact-address" className="block text-sm font-semibold text-text-dark mb-2">Contact Address (comma separated)</label>
            <Input id="about-contact-address" value={formData.contactAddress} onChange={(e) => setFormData((prev) => ({ ...prev, contactAddress: e.target.value }))} />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full">
              <Save className="w-5 h-5 mr-2" />
              Save About Content
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

const QRCodeTab = () => {
  const [url, setUrl] = useState('https://globalmission-events.github.io/EVENTS-UPDATES/')
  const [size, setSize] = useState(256)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = useCallback(() => {
    if (!url || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 4,
      errorCorrectionLevel: 'H',
      color: { dark: '#1e3a5f', light: '#ffffff' },
    }, (error: unknown) => {
      if (error) console.error(error)
    })
  }, [url, size])

  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  const downloadPNG = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'gmci-qrcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const downloadSVG = async () => {
    try {
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        width: size,
        margin: 4,
        errorCorrectionLevel: 'H',
        color: { dark: '#1e3a5f', light: '#ffffff' },
      })
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const link = document.createElement('a')
      link.download = 'gmci-qrcode.svg'
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <p className="text-text-light text-center mb-8 text-lg">
        Generate QR codes for your event links
      </p>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="cms-qr-url" className="block text-sm font-semibold text-text-dark mb-2">
              URL
            </label>
            <Input
              id="cms-qr-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <div className="block text-sm font-semibold text-text-dark mb-2">
              QR Code Size (pixels)
            </div>
            <div className="flex gap-4">
              {[128, 256, 512, 1024].map((s) => (
                <Button
                  key={s}
                  variant={size === s ? 'primary' : 'secondary'}
                  onClick={() => setSize(s)}
                  className="flex-1"
                >
                  {s}px
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={downloadPNG} size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download PNG
          </Button>
          <Button onClick={downloadSVG} variant="secondary" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download SVG
          </Button>
        </div>
      </div>
    </>
  )
}