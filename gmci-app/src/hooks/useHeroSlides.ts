import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { HeroSlide } from '@/types'

const DEFAULT_SLIDES: Omit<HeroSlide, 'id'>[] = [
  { image: '/images/hero images/global.jpg', alt: 'Global Mission', position: 1, focalX: 50, focalY: 50, scale: 1 },
  { image: '/images/hero images/global 2.jpg', alt: 'Worship Service', position: 2, focalX: 50, focalY: 50, scale: 1 },
  { image: '/images/hero images/global4.webp', alt: 'Humanitarian Work', position: 3, focalX: 50, focalY: 50, scale: 1 },
  { image: '/images/hero images/global.webp', alt: 'Community Outreach', position: 4, focalX: 50, focalY: 50, scale: 1 },
  { image: '/images/hero images/global5.webp', alt: 'Prayer Gathering', position: 5, focalX: 50, focalY: 50, scale: 1 },
]

export const useHeroSlides = () => {
  const queryClient = useQueryClient()

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['heroSlides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        console.error('Error fetching hero slides:', error)
        return []
      }

      if (!data || data.length === 0) {
        for (const slide of DEFAULT_SLIDES) {
          await supabase.from('hero_slides').insert(slide)
        }
        const { data: seeded } = await supabase
          .from('hero_slides')
          .select('*')
          .order('position', { ascending: true })
        return (seeded || []) as HeroSlide[]
      }

      return data as HeroSlide[]
    },
  })

  const addSlideMutation = useMutation({
    mutationFn: async (newSlide: Omit<HeroSlide, 'id'>) => {
      const maxPos = slides.reduce((max, s) => Math.max(max, s.position || 0), 0)
      const { data, error } = await supabase
        .from('hero_slides')
        .insert({ ...newSlide, position: maxPos + 1 })
        .select()
        .single()
      if (error) throw error
      return data as HeroSlide
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] })
    },
  })

  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, ...slide }: HeroSlide) => {
      const { data, error } = await supabase
        .from('hero_slides')
        .update(slide)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as HeroSlide
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] })
    },
  })

  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] })
    },
  })

  const reorderSlidesMutation = useMutation({
    mutationFn: async (newOrder: HeroSlide[]) => {
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('hero_slides')
          .update({ position: i + 1 })
          .eq('id', newOrder[i].id)
      }
      return newOrder
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] })
    },
  })

  return {
    slides,
    isLoading,
    addSlide: (slide: Omit<HeroSlide, 'id'>) => addSlideMutation.mutate(slide),
    updateSlide: (slide: HeroSlide) => updateSlideMutation.mutate(slide),
    deleteSlide: (id: number) => deleteSlideMutation.mutate(id),
    reorderSlides: (newOrder: HeroSlide[]) => reorderSlidesMutation.mutate(newOrder),
  }
}