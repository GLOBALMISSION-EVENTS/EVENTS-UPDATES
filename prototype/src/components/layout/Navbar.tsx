import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  isLoggedIn?: boolean
  onLogout?: () => void
}

export const Navbar = ({ isLoggedIn = false, onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'events', label: 'Events', href: '#events' },
    { id: 'about', label: 'About Us', href: '#about' },
  ]

  if (isLoggedIn) {
    navItems.push({ id: 'cms', label: 'CMS Admin', href: '#cms' })
    navItems.push({ id: 'qrcode', label: 'QR Generator', href: '/qrcode' })
  }

  const handleNavClick = (id: string, href: string) => {
    setActiveSection(id)
    setIsMobileMenuOpen(false)
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-4">
            <img
              src="/images/GLOBAL LOGO.png"
              alt="GMCI Logo"
              className="h-12 w-12 object-contain"
            />
            <span className="text-xl font-bold text-white hidden sm:block">
              Global Mission For Christ International
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id, item.href)
                }}
                className={`text-white font-medium transition-colors hover:text-secondary ${
                  activeSection === item.id ? 'text-secondary' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
            {isLoggedIn && onLogout && (
              <button
                onClick={onLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id, item.href)
                }}
                className={`block text-white font-medium py-2 ${
                  activeSection === item.id ? 'text-secondary' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
            {isLoggedIn && onLogout && (
              <button
                onClick={onLogout}
                className="w-full text-left text-white font-medium py-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
