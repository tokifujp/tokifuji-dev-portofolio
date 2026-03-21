'use client'

import styles from './MobileHints.module.css'
import { COMMANDS } from '@/lib/commands'

interface Props {
  onCommand: (cmd: string) => void
}

export default function MobileHints({ onCommand }: Props) {
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
