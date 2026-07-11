import React, { useState, useRef, useEffect } from 'react'
import { Edit2, Trash2, Plus, Download, Upload, RotateCcw, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Sortable from 'sortablejs'
import type { Event } from '@/types'

interface CMSSectionProps {
  events: Event[]
  onAddEvent: (event: Omit<Event, 'id'>) => void
  onUpdateEvent: (id: number, event: Partial<Event>) => void
  onDeleteEvent: (id: number) => void
  onReorderEvents: (newOrder: Event[]) => void
  onResetEvents: () => void
  onExportEvents: () => void
  onImportEvents: (file: File) => void
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
}: CMSSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    venue: string;
    description: string;
    type: 'upcoming' | 'recent';
    image: string;
  }>({
    title: '',
    date: '',
    venue: '',
    description: '',
    type: 'upcoming',
    image: '',
  })
  const [selectedImageFile, setSelectedImageFile] = useState<string | null>(null)
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

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
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
      setFormData({
        title: '',
        date: '',
        venue: '',
        description: '',
        type: 'upcoming',
        image: '',
      })
      setSelectedImageFile(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
    setFormData({
      title: '',
      date: '',
      venue: '',
      description: '',
      type: 'upcoming',
      image: '',
    })
    setSelectedImageFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const eventData = {
      ...formData,
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
    <section id="cms" className="py-20 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-4xl font-bold text-text-dark">
            Content Management System
          </h2>
        </div>
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
                    onClick={() => onDeleteEvent(event.id)}
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Event Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Date
            </label>
            <Input
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              placeholder="e.g., 10th July 2026 - 9AM"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Venue
            </label>
            <Input
              value={formData.venue}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, venue: e.target.value }))
              }
              placeholder="e.g., Y.M.C.A. Hall - Nyeri Town"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Event Type
            </label>
            <select
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
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Upload Image from Computer
            </label>
            <Input
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
            <label className="block text-sm font-semibold text-text-dark mb-2">
              OR Image Path/URL (optional)
            </label>
            <Input
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
    </section>
  )
}
