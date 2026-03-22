'use client'

import styles from './MobileHints.module.css'
import { COMMANDS } from '@/lib/commands'

interface Props {
  onCommand: (cmd: string) => void
  isFormActive: boolean
  onCancel?: () => void
}

export default function MobileHints({ onCommand, isFormActive, onCancel }: Props) {
  if (isFormActive) {
    return (
      <div className={styles.hints}>
        <button
          className={`${styles.chip} ${styles.chipCancel}`}
          onClick={e => { e.stopPropagation(); onCancel?.() }}
        >
          キャンセル
        </button>
      </div>
    )
  }

  const displayCommands = COMMANDS.filter(c => c.command !== '/clear')

  return (
    <div className={styles.hints}>
      {displayCommands.map(def => (
        <button
          key={def.command}
          className={styles.chip}
          onClick={e => {
            e.stopPropagation()
            onCommand(def.command)
          }}
        >
          {def.command}
        </button>
      ))}
    </div>
  )
}
