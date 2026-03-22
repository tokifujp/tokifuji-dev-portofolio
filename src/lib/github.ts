import type { WorkItem } from '@/types/terminal'
import { WORKS } from './content'

const GITHUB_USERNAME = 'tokifujp'

const PINNED_QUERY = `{
  user(login: "${GITHUB_USERNAME}") {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          homepageUrl
          stargazerCount
          updatedAt
          languages(first: 4, orderBy: {field: SIZE, direction: DESC}) {
            nodes { name }
          }
        }
      }
    }
  }
}`

export async function fetchPinnedRepos(): Promise<WorkItem[]> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return WORKS

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: PINNED_QUERY }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) return WORKS

    const json = await res.json()
    const nodes: any[] = json.data?.user?.pinnedItems?.nodes ?? []

    if (nodes.length === 0) return WORKS

    return nodes.map((repo): WorkItem => ({
      title: repo.name,
      description: [
        repo.description ?? '',
        repo.stargazerCount > 0 ? `★ ${repo.stargazerCount}` : '',
      ].filter(Boolean).join('  '),
      url: repo.homepageUrl || repo.url,
      tags: (repo.languages?.nodes ?? []).map((l: { name: string }) => l.name),
      year: new Date(repo.updatedAt).getFullYear(),
    }))
  } catch {
    return WORKS
  }
}
