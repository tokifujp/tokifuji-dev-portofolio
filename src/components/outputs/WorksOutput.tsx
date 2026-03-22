import styles from './output.module.css'
import type { WorkItem } from '@/types/terminal'

export default function WorksOutput({ works }: { works: WorkItem[] }) {
  let idx = 0
  return (
    <div className={styles.block}>
      <div className={styles.header}>Works</div>
      {works.map((work, i) => {
        const baseDelay = idx
        idx += 4
        return (
          <div key={i}>
            <div className={styles.row} style={{ animationDelay: `${baseDelay * 60}ms` }}>
              <span className={styles.label}>
                <span className={styles.workYear}>{work.year}</span>
              </span>
              <span className={styles.workTitle}>
                {work.url
                  ? <a href={work.url} target="_blank" rel="noopener noreferrer">{work.title}</a>
                  : work.title
                }
              </span>
            </div>
            <div
              className={styles.note}
              style={{ animationDelay: `${(baseDelay + 1) * 60}ms`, paddingLeft: '132px', marginBottom: '4px' }}
            >
              {work.description}
            </div>
            <div
              className={styles.row}
              style={{ animationDelay: `${(baseDelay + 2) * 60}ms`, paddingLeft: '132px', marginBottom: '12px' }}
            >
              <span>
                {work.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
