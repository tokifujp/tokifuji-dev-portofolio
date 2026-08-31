import styles from './output.module.css'
import type { BlogPost } from '@/types/terminal'

export default function BlogOutput({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className={styles.block}>
        <div className={styles.header}>Blog</div>
        <div className={styles.note}>まだ記事がありません。</div>
      </div>
    )
  }

  let idx = 0
  return (
    <div className={styles.block}>
      <div className={styles.header}>Blog</div>
      {posts.map((post, i) => {
        const baseDelay = idx
        idx += 3
        return (
          <div key={i}>
            <div className={styles.row} style={{ animationDelay: `${baseDelay * 60}ms` }}>
              <span className={styles.label}>
                <span className={styles.workYear}>{post.publishedAt}</span>
              </span>
              <span className={styles.workTitle}>
                <a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
              </span>
            </div>
            <div
              className={styles.note}
              style={{ animationDelay: `${(baseDelay + 1) * 60}ms`, paddingLeft: '132px', marginBottom: '12px' }}
            >
              {post.excerpt}
            </div>
          </div>
        )
      })}
    </div>
  )
}
