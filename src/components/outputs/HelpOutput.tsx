import styles from './output.module.css'
import { COMMANDS } from '@/lib/commands'

export default function HelpOutput() {
  return (
    <div className={styles.block}>
      <div className={styles.header}>Available Commands</div>
      {COMMANDS.map((def, i) => (
        <div
          key={def.command}
          className={styles.cmdRow}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className={styles.cmdName}>{def.command}</span>
          <span className={styles.cmdDesc}>— {def.description}</span>
        </div>
      ))}
    </div>
  )
}
