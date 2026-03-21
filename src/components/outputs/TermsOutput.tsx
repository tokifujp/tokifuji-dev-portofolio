import styles from './output.module.css'
import { TERMS } from '@/lib/content'

export default function TermsOutput() {
  return (
    <div className={styles.block}>
      <div className={styles.header}>{TERMS.title}</div>
      <div className={styles.note} style={{ animationDelay: '0ms' }}>
        最終更新: {TERMS.updatedAt}
      </div>
      {TERMS.sections.map((section, i) => (
        <div
          key={i}
          className={styles.row}
          style={{ animationDelay: `${(i + 1) * 60}ms`, flexDirection: 'column', gap: '2px' }}
        >
          <span className={styles.cmdName}>{section.heading}</span>
          <span className={styles.value}>{section.body}</span>
        </div>
      ))}
    </div>
  )
}
