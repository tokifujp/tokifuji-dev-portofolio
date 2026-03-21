import styles from './output.module.css'
import { PRIVACY } from '@/lib/content'

export default function PrivacyOutput() {
  return (
    <div className={styles.block}>
      <div className={styles.header}>{PRIVACY.title}</div>
      <div className={styles.note} style={{ animationDelay: '0ms' }}>
        最終更新: {PRIVACY.updatedAt}
      </div>
      {PRIVACY.sections.map((section, i) => (
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
