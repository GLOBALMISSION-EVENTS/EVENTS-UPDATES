import React, { useState, useRef, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, ArrowLeft } from 'lucide-react'
import QRCode from 'qrcode'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export const QRCodeGenerator = () => {
  const [url, setUrl] = useState('https://globalmission-events.github.io/EVENTS-UPDATES/')
  const [size, setSize] = useState(1024)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isLoggedIn, logout } = useAuth()

  const generateQRCode = React.useCallback(() => {
    if (!url) return

    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 4,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1e3a5f',
        light: '#ffffff',
      },
    }, (error: unknown) => {
      if (error) console.error(error)
    })
  }, [url, size])

  useEffect(() => {
    generateQRCode()
  }, [url, size, generateQRCode])

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
        color: {
          dark: '#1e3a5f',
          light: '#ffffff',
        },
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
    <div className="min-h-screen bg-light-bg">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
      
      <div className="pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-text-dark mb-8 text-center">
              QR Code Generator
            </h1>

            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="qr-url" className="block text-sm font-semibold text-text-dark mb-2">
                  URL
                </label>
                <Input
                  id="qr-url"
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
                  {[256, 512, 1024, 2048].map((s) => (
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
        </div>
      </div>

      <Footer />
    </div>
  )
}
