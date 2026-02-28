import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { InventoryProvider } from '@/contexts/InventoryContext'
import { SalesProvider } from '@/contexts/SalesContext'
import { SettingsProvider } from '@/contexts/SettingsContext'

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ورشة تغيير الزيت',
  description: 'نظام إدارة ورشة تغيير الزيت',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.className} bg-slate-950 text-slate-100 antialiased min-h-screen`}>
        <SettingsProvider>
          <InventoryProvider>
            <SalesProvider>
              {children}
            </SalesProvider>
          </InventoryProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
