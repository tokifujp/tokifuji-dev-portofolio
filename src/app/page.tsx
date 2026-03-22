import { readFileSync } from 'fs'
import path from 'path'
import Terminal from '@/components/Terminal/Terminal'
import { fetchPinnedRepos } from '@/lib/github'

export default async function Home() {
  const bannerArt = readFileSync(path.join(process.cwd(), 'public/banner.txt'), 'utf-8')
  const works = await fetchPinnedRepos()
  return (
    <main>
      <Terminal bannerArt={bannerArt} works={works} />
    </main>
  )
}
