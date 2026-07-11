import { useState, useEffect } from 'react'
import { getImageUrl } from '@/lib/utils'
import type { HeroSlide } from '@/types'

interface HeroCarouselProps {
  slides?: HeroSlide[]
}

const PHRASES = [
  'Preach the Gospel. Win Souls.',
  'Heal the Nations. Restore Hope.',
  'Raise the Next Generation.',
  'Ignite Revival Worldwide.',
]

const SCRIPTURES = [
  'Matthew 5:6 — Blessed are those who hunger and thirst for righteousness',
  'Amos 9:14 — From Exile to Divine Restoration',
  'Isaiah 61:1 — Proclaim freedom for the captives',
  'Mark 16:15 — Go into all the world and preach the gospel',
]

export const HeroCarousel = ({ slides = [] }: HeroCarouselProps) => {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [scriptureIndex, setScriptureIndex] = useState(0)
  const [showText, setShowText] = useState(true)

  const heroImage = slides[0]?.image || '/images/hero images/global.webp'

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setShowText(false)
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
        setShowText(true)
      }, 600)
    }, 4000)

    return () => clearInterval(phraseInterval)
  }, [])

  useEffect(() => {
    const scriptureInterval = setInterval(() => {
      setScriptureIndex((prev) => (prev + 1) % SCRIPTURES.length)
    }, 8000)

    return () => clearInterval(scriptureInterval)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageUrl(heroImage)})` }}
      />

      <img
        src={getImageUrl(heroImage)}
        alt="Global Mission For Christ International"
        className="absolute inset-0 w-full h-full object-cover"
        width="1920"
        height="1080"
        loading="eager"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/50 to-dark/90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/10 z-10" />

      <div className="absolute top-0 left-0 right-0 z-0 overflow-hidden h-full pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-secondary mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Global Mission For Christ International
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 font-serif leading-tight">
            {'REVIVE THE NATIONS'.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${0.8 + i * 0.035}s`,
                  animationFillMode: 'forwards',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <div className="h-12 md:h-14 flex items-center justify-center mb-6">
            <p
              className={`text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 transition-all duration-600 ${
                showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {PHRASES[phraseIndex]}
            </p>
          </div>

          <div className="h-8 flex items-center justify-center mb-10">
            <p className="text-sm md:text-base text-secondary/80 font-medium italic transition-all duration-500">
              "{SCRIPTURES[scriptureIndex]}"
            </p>
          </div>

          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
            <a
              href="#events"
              className="inline-block bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/30"
            >
              View Upcoming Events
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === 0 ? 'bg-secondary w-6' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
