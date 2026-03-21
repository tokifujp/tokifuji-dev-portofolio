import { readFileSync } from 'fs'
import path from 'path'
import Terminal from '@/components/Terminal/Terminal'

export default function Home() {
  const bannerArt = readFileSync(path.join(process.cwd(), 'public/banner.txt'), 'utf-8')
  return (
    <main>
      <Terminal bannerArt={bannerArt} />
    </main>
  )
}
