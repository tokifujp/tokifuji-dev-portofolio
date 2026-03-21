'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import styles from './InputLine.module.css'
import { getSuggestion } from '@/lib/commands'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: (v: string) => void
  onHistoryUp: (current: string) => string
  onHistoryDown: () => string
  focusTrigger: number
  /** Form mode: replaces $ prompt with e.g. "Elon Musk >" */
  promptLabel?: string
}

export default function InputLine({
  value, onChange, onSubmit,
  onHistoryUp, onHistoryDown,
  focusTrigger, promptLabel,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestion = !promptLabel ? getSuggestion(value) : null

  useEffect(() => {
    inputRef.current?.focus()
  }, [focusTrigger])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit(value)
    } else if (!promptLabel && e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(onHistoryUp(value))
    } else if (!promptLabel && e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(onHistoryDown())
    } else if (e.key === 'Tab' || (e.key === 'ArrowRight' && suggestion && inputRef.current?.selectionStart === value.length)) {
      if (suggestion) {
        e.preventDefault()
        onChange(value + suggestion)
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      {promptLabel ? (
        <span className={styles.promptForm}>
          <span className={styles.promptFormPlaceholder}>{promptLabel}</span>
          <span className={styles.promptFormArrow}> &gt;</span>
        </span>
      ) : (
        <span className={styles.prompt}>$</span>
      )}
      <div className={styles.inputArea}>
        {suggestion && (
          <span className={styles.suggestion}>{value}<span>{suggestion}</span></span>
        )}
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
