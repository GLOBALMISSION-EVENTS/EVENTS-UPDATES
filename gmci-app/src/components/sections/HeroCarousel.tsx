import { useState, useEffect, useRef, useCallback } from 'react'
import { getImageUrl } from '@/lib/utils'
const ParticlesCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = canvas.width = canvas.offsetWidth
    let h = canvas.height = canvas.offsetHeight

    const resize = () => {
      w = canvas!.width = canvas!.offsetWidth
      h = canvas!.height = canvas!.offsetHeight
    }
    window.addEventListener('resize', resize)

    const count = Math.min(Math.floor((w * h) / 12000), 80)
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1,
        a: Math.random() * 0.4 + 0.1,
      })
    }

    const draw = () => {
      ctx!.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255,255,255,${p.a})`
        ctx!.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 120)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  )
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

export const HeroCarousel = () => {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [scriptureIndex, setScriptureIndex] = useState(0)
  const [showText, setShowText] = useState(true)
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true)

  const heroRef = useRef<HTMLDivElement>(null)
  const parallaxBgRef = useRef<HTMLDivElement>(null)
  const parallaxContentRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const heroImage = '/images/istockphoto-1473132437-612x612.jpg'

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setShowText(false)
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
        setShowText(true)
      }, 600)
    }, 7000)
    return () => clearInterval(phraseInterval)
  }, [])

  useEffect(() => {
    const scriptureInterval = setInterval(() => {
      setScriptureIndex((prev) => (prev + 1) % SCRIPTURES.length)
    }, 10000)
    return () => clearInterval(scriptureInterval)
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY
          setScrollIndicatorVisible(sy < 80)
          if (parallaxBgRef.current) {
            parallaxBgRef.current.style.transform = `translateY(${sy * 0.35}px)`
          }
          if (parallaxContentRef.current) {
            parallaxContentRef.current.style.transform = `translateY(${sy * 0.15}px)`
            parallaxContentRef.current.style.opacity = `${Math.max(1 - sy / (window.innerHeight * 0.6), 0)}`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    imgRef.current?.setAttribute('fetchpriority', 'high')
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
  }, [])

  return (
    <div
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden cursor-glow"
      onMouseMove={handleMouseMove}
    >
      <div
        ref={parallaxBgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${getImageUrl(heroImage)})`,
          transform: 'translateY(0px)',
        }}
      />

      <img
        ref={imgRef}
        src={getImageUrl(heroImage)}
        alt="Global Mission For Christ International"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        width="1920"
        height="1080"
        loading="eager"
      />

      <ParticlesCanvas />

      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/50 to-dark/90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/10 z-10" />

      <div className="absolute top-0 left-0 right-0 z-0 overflow-hidden h-full pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div
        ref={parallaxContentRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4 will-change-transform"
        style={{ transform: 'translateY(0px)', opacity: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-secondary mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
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
              className={`text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 transition-all duration-700 ${
                showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              {PHRASES[phraseIndex]}
            </p>
          </div>

          <div className="h-8 flex items-center justify-center mb-10">
            <p
              className="text-sm md:text-base text-secondary/80 font-medium italic transition-all duration-700"
              key={scriptureIndex}
              style={{
                animation: 'fadeIn 0.7s ease-out forwards',
              }}
            >
              &quot;{SCRIPTURES[scriptureIndex]}&quot;
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

      <div
        className={`absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-2 transition-opacity duration-500 ${
          scrollIndicatorVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <svg
          className="w-6 h-6 text-white/50 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}
