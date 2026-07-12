import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { getImageUrl } from '@/lib/utils'

interface NavbarProps {
  isLoggedIn?: boolean
  onLogout?: () => Promise<void>
}

export const Navbar = ({ isLoggedIn = false, onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'events', label: 'Events', href: '#events' },
    { id: 'about', label: 'About Us', href: '#about' },
  ]

  navItems.push({ id: 'admin', label: 'Admin', href: '/admin' })

  if (isLoggedIn) {
    navItems.push({ id: 'qrcode', label: 'QR Generator', href: '/qrcode' })
  }

  const handleNavClick = (id: string, href: string) => {
    setActiveSection(id)
    setIsMobileMenuOpen(false)
    if (href.startsWith('#') && location.pathname === '/') {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout()
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <nav className="bg-cream text-text-dark shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                src={getImageUrl('/images/GLOBAL LOGO.png')}
                alt="GMCI Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                width="48"
                height="48"
              />
            </Link>
            <span className="text-lg sm:text-xl font-bold hidden sm:block">
              Global Mission For Christ International
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => handleNavClick(item.id, item.href)}
                  className={`font-medium transition-colors hover:text-secondary ${
                    activeSection === item.id ? 'text-secondary' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.id, item.href)
                  }}
                  className={`font-medium transition-colors hover:text-secondary ${
                    activeSection === item.id ? 'text-secondary' : ''
                  }`}
                >
                  {item.label}
                </a>
              )
            ))}
            {isLoggedIn && onLogout && (
              <button
                onClick={handleLogout}
                className="bg-dark/10 hover:bg-dark/20 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 -mr-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7 sm:w-8 sm:h-8" />
            ) : (
              <Menu className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
            tabIndex={-1}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute top-20 left-0 right-0 bg-cream shadow-xl animate-fade-in"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => handleNavClick(item.id, item.href)}
                    className={`block font-medium min-h-[44px] flex items-center px-4 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'text-secondary bg-secondary/10'
                        : 'hover:bg-dark/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(item.id, item.href)
                    }}
                    className={`block font-medium min-h-[44px] flex items-center px-4 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'text-secondary bg-secondary/10'
                        : 'hover:bg-dark/5'
                    }`}
                  >
                    {item.label}
                  </a>
                )
              ))}
              {isLoggedIn && onLogout && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left font-medium min-h-[44px] flex items-center px-4 rounded-lg hover:bg-dark/5 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
