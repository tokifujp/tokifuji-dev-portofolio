import type { Metadata } from 'next'
import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const adsenseAccount = process.env.GOOGLE_ADSENSE_ACCOUNT

  return {
    title: 'tokifuji.dev',
    description: 'ウェブ開発・受託制作 | Web development freelancer',
    icons: { icon: '/favicon.ico' },
    ...(adsenseAccount ? { other: { 'google-adsense-account': adsenseAccount } } : {}),
    openGraph: {
      title: 'tokifuji.dev',
      description: 'ウェブ開発・受託制作',
      type: 'website',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
