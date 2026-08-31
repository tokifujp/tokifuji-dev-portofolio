import type { BlogPost, WorkItem } from '@/types/terminal'
import { BLOG_POSTS, WORKS } from './content'

const GITHUB_USERNAME = 'tokifujp'
const BLOG_REPO = 'tokifuji-dev-portofolio'
const BLOG_LABEL = 'blog'

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

function excerptFromMarkdown(body: string, maxLength = 100): string {
  const plain = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>~-]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return plain.length > maxLength ? plain.slice(0, maxLength) + '…' : plain
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const token = process.env.GITHUB_TOKEN

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${BLOG_REPO}/issues?state=closed&labels=${BLOG_LABEL}&per_page=50`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return BLOG_POSTS

    const issues: any[] = await res.json()
    const posts = issues
      .filter(issue => !issue.pull_request)
      .map((issue): BlogPost => ({
        title: issue.title,
        url: issue.html_url,
        excerpt: excerptFromMarkdown(issue.body ?? ''),
        publishedAt: (issue.closed_at ?? issue.created_at).slice(0, 10),
      }))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    return posts.length > 0 ? posts : BLOG_POSTS
  } catch {
    return BLOG_POSTS
  }
}
