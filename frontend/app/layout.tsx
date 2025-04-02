import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'College Media Platform',
  description: 'Connect with your college community',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
