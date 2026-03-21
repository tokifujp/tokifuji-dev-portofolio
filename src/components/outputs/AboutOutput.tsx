import styles from './output.module.css'
import { PROFILE } from '@/lib/content'

export default function AboutOutput() {
  const rows = [
    { label: 'name',     value: PROFILE.name },
    { label: 'role',     value: PROFILE.role },
    { label: 'location', value: PROFILE.location },
    { label: 'bio',      value: PROFILE.bio, multiLine: true },
    null,
    { label: 'github',   value: <a href={`https://${PROFILE.links.github.replace('https://', '')}`} target="_blank" rel="noopener noreferrer">{PROFILE.links.github}</a> },
    null,
    { label: 'skills',   value: PROFILE.skills.join(' · ') },
  ]

  let rowIndex = 0
  return (
    <div className={styles.block}>
      <div className={styles.header}>About</div>
      {rows.map((row, i) => {
        if (!row) {
          return (
            <hr
              key={i}
              className={styles.divLine}
              style={{ animationDelay: `${rowIndex++ * 60}ms` }}
            />
          )
        }
        const delay = `${rowIndex++ * 60}ms`
        return (
          <div key={i} className={styles.row} style={{ animationDelay: delay }}>
            <span className={styles.label}>{row.label}</span>
            <span className={`${styles.value}${row.multiLine ? ' ' + styles.multiLine : ''}`}>
              {row.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
