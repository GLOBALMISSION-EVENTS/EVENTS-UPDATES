import { getImageUrl } from '@/lib/utils'
import type { AboutContent } from '@/types'

interface AboutSectionProps {
  content?: AboutContent | null
}

const defaultContent = {
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

export const AboutSection = ({ content }: AboutSectionProps) => {
  const c = content || defaultContent

  const contactItems = [
    { icon: '📞', content: c.contactPhone },
    { icon: '✉️', content: c.contactEmail, isEmail: true },
    { icon: '🐦', content: [c.contactTwitter] },
    { icon: '▶️', content: [c.contactYoutube] },
    { icon: '📍', content: c.contactAddress },
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-8">
              About Us
            </h2>

            <div className="mb-8">
              <img
                src={getImageUrl(c.aboutImage || '/images/about-us.png')}
                alt="Global Mission For Christ International"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-light-bg p-6 rounded-xl">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-text-dark mb-3">Vision</h3>
                <p className="text-text-light">{c.vision}</p>
              </div>
              <div className="bg-light-bg p-6 rounded-xl">
                <div className="text-4xl mb-4">✝️</div>
                <h3 className="text-xl font-bold text-text-dark mb-3">Mission</h3>
                <p className="text-text-light">{c.mission}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-text-dark mb-4">Our Values</h3>
              <ul className="space-y-3 text-lg text-text-light">
                {c.values.map((v, i) => (
                  <li key={i}>✦ {v}</li>
                ))}
              </ul>
            </div>

            <div className="bg-light-bg p-8 rounded-xl">
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={getImageUrl(c.directorImage || '/images/DIRECTOR.png')}
                  alt={c.directorName}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-2xl font-bold text-text-dark">Director&apos;s Message</h3>
                  <p className="text-secondary font-semibold">{c.directorName}</p>
                  <p className="text-text-light">{c.directorTitle}</p>
                </div>
              </div>
              <div className="space-y-4 text-text-light">
                {c.directorMessage.map((msg, i) => (
                  <p key={i} className={i === c.directorMessage.length - 1 ? 'font-bold text-text-dark' : ''}>
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-primary text-white p-8 rounded-2xl sticky top-8">
              <h3 className="text-2xl font-bold mb-8">Contact Us</h3>
              <div className="space-y-6">
                {contactItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      {item.content.map((line, i) => (
                        <p key={i} className="text-white/90">
                          {item.isEmail ? (
                            <a href={`mailto:${line}`} className="hover:text-secondary transition-colors">
                              {line}
                            </a>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
