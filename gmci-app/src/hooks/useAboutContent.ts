import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { AboutContent } from '@/types'

const DEFAULT_CONTENT: Omit<AboutContent, 'id'> = {
  vision: 'Propagate Revival to the nations of the world and draw men to Christ by the power of the Lord Jesus Christ.',
  mission: 'Global mission for Christ international is dedicated to igniting the fire of revival and to the teachings of the word of God. Raising men and women who will impact their generation through prayer, passion, and praise.',
  values: ['Prayers', 'Word of God', 'Power of the Holy Spirit', 'Righteousness', 'Passion'],
  directorName: 'Rev. Dr. Anthony Waithaka',
  directorTitle: 'Director, Global Mission for Christ International',
  directorImage: '/images/DIRECTOR.png',
  directorMessage: [
    'At Global Mission for Christ International, our heartbeat is to see lives transformed by the power of Jesus Christ and revival spread to the nations of the world.',
    'We are committed to raising men and women grounded in prayer, rooted in the Word of God, empowered by the Holy Spirit, passionate for righteousness, and dedicated to impacting their generation for Christ.',
    'As a ministry, we continue to reach communities through the Gospel, prayer gatherings, revival meetings, and acts of compassion by supporting the needy through medical and community outreach programs.',
    'May this ministry continue to inspire faith, ignite passion for God, and draw many into a deeper relationship with Christ. Together, let us shine His light and carry the message of hope to the world.',
  ],
  aboutImage: '/images/about-us.png',
  contactPhone: ['+254 715 493 666', '+254 710 642 232'],
  contactEmail: ['globalmissionfci@gmail.com', 'info@globalmissionfci.org'],
  contactTwitter: 'Twitter',
  contactYoutube: 'YouTube: @GlobalMissionForChristK',
  contactAddress: ['P.O. BOX 444 - 10100', 'Kenya'],
}

export const useAboutContent = () => {
  const queryClient = useQueryClient()

  const { data: content, isLoading } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'about')
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: inserted } = await supabase
            .from('site_content')
            .insert({ section: 'about', ...DEFAULT_CONTENT })
            .select()
            .single()
          return (inserted || { id: 1, section: 'about', ...DEFAULT_CONTENT }) as AboutContent & { section: string }
        }
        console.error('Error fetching about content:', error)
        return { id: 1, section: 'about', ...DEFAULT_CONTENT } as AboutContent & { section: string }
      }

      return data as AboutContent & { section: string }
    },
  })

  const updateContentMutation = useMutation({
    mutationFn: async (updated: Partial<AboutContent>) => {
      const { data, error } = await supabase
        .from('site_content')
        .update(updated)
        .eq('section', 'about')
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] })
    },
  })

  return {
    content,
    isLoading,
    updateContent: (updated: Partial<AboutContent>) => updateContentMutation.mutate(updated),
  }
}