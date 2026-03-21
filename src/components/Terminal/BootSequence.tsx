'use client'

import { useState, useEffect } from 'react'
import styles from './BootSequence.module.css'

const BOOT_LINES = [
  { text: 'Initializing portfolio v1.0.0...', delay: 200 },
  { text: 'Loading modules: [████████████████] 100%', delay: 700 },
  { text: 'Connection established.', delay: 1300 },
]

const WELCOME_LINE = { text: 'Welcome. Type /help to get started.', delay: 1800 }

interface Props {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay))
    })

    timers.push(setTimeout(() => setShowWelcome(true), WELCOME_LINE.delay))
    timers.push(setTimeout(() => onComplete(), WELCOME_LINE.delay + 600))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className={styles.container}>
      {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
        <div
          key={i}
          className={styles.line}
          style={{ animationDelay: '0ms' }}
        >
          {line.text}
        </div>
      ))}
      {showWelcome && (
        <div className={styles.lineAccent} style={{ animationDelay: '0ms' }}>
          {WELCOME_LINE.text}
        </div>
      )}
    </div>
  )
}
