import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/store'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://bluestonetrustbank.com'),
  title: 'BlueStone Trust Bank — Secure Banking for Everyone',
  description:
    'BlueStone Trust Bank offers secure, seamless digital banking. Open an account, transfer funds, manage deposits, and more.',
  keywords: 'bank, online banking, trust bank, BlueStone, secure payments, digital banking',
  icons: {
    icon: [
      { url: '/banklogo.png', type: 'image/png' },
    ],
    apple: '/banklogo.png',
  },
  openGraph: {
    title: 'BlueStone Trust Bank — Secure Banking for Everyone',
    description:
      'BlueStone Trust Bank offers secure, seamless digital banking. Open an account, transfer funds, manage deposits, and more.',
    url: 'https://bluestonetrustbank.com',
    siteName: 'BlueStone Trust Bank',
    images: [
      {
        url: '/banklogo.png',
        width: 1200,
        height: 630,
        alt: 'BlueStone Trust Bank',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlueStone Trust Bank — Secure Banking for Everyone',
    description:
      'BlueStone Trust Bank offers secure, seamless digital banking. Open an account, transfer funds, manage deposits, and more.',
    images: ['/banklogo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0c2d4e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="antialiased font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
