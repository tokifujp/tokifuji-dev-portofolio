import styles from './output.module.css'
import { SERVICES } from '@/lib/content'

export default function ServicesOutput() {
  let idx = 0
  return (
    <div className={styles.block}>
      <div className={styles.header}>Services</div>
      {SERVICES.map((svc, i) => {
        const baseDelay = idx
        idx += 3
        return (
          <div key={i}>
            <div className={styles.row} style={{ animationDelay: `${baseDelay * 60}ms` }}>
              <span className={styles.label}>{svc.name}</span>
              {svc.price && <span className={styles.price}>{svc.price}</span>}
            </div>
            <div
              className={styles.note}
              style={{ animationDelay: `${(baseDelay + 1) * 60}ms`, paddingLeft: '120px', marginBottom: '10px' }}
            >
              {svc.description}
            </div>
          </div>
        )
      })}
    </div>
  )
}
