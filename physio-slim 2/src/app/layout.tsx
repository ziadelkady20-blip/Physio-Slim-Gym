import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/lib/auth-context'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Physio Slim Health Club | Premium Fitness in Fayoum',
  description:
    'Physio Slim Health Club – Premium fitness experience in Fayoum, Egypt. Professional coaches, advanced equipment, and flexible membership plans.',
  keywords: 'gym, fitness, fayoum, health club, physio slim',
  openGraph: {
    title: 'Physio Slim Health Club',
    description: 'Transform Your Body. Build Your Strength. Unlock Your Potential.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="bg-dark text-white font-inter antialiased overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
