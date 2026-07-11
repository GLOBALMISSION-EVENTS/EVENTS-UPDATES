import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import type { HeroSlide } from '@/types'

interface HeroCarouselProps {
  slides?: HeroSlide[]
}

const AUTO_PLAY_INTERVAL = 12000

export const HeroCarousel = ({ slides = [] }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideCount = slides.length || 1

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount)
  }, [slideCount])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount)
  }, [slideCount])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute -inset-[10%] w-[120%] h-[120%] bg-cover bg-center blur-[25px] z-0 opacity-40 animate-slow-pan"
            style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
          />
          <img
            src={getImageUrl(slide.image)}
            alt={slide.alt}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover z-10 opacity-95"
            style={{
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/60 to-dark/95 z-20 pointer-events-none" />
        </div>
      ))}

      <div className="absolute top-0 left-0 right-0 bottom-0 z-30 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 font-serif">
          REVIVE THE NATIONS
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold mb-4">
          Preach the Gospel. Win Souls.
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Christ for Every Nation
        </p>
        <a
          href="#events"
          className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
        >
          View Upcoming Events
        </a>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 flex gap-5">
        <button
          onClick={prevSlide}
          className="w-12 h-12 bg-white/20 border-2 border-white/40 text-white text-2xl rounded-full cursor-pointer transition-all duration-300 hover:bg-secondary hover:border-secondary hover:scale-110 backdrop-blur-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 mx-auto" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 bg-white/20 border-2 border-white/40 text-white text-2xl rounded-full cursor-pointer transition-all duration-300 hover:bg-secondary hover:border-secondary hover:scale-110 backdrop-blur-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 mx-auto" />
        </button>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentSlide
                ? 'bg-secondary scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
