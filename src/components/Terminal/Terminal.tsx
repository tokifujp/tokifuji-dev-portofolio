'use client'

import { useState, useCallback } from 'react'
import styles from './Terminal.module.css'
import { useTerminal } from '@/hooks/useTerminal'
import { useCommandHistory } from '@/hooks/useCommandHistory'
import BootSequence from './BootSequence'
import OutputHistory from './OutputHistory'
import InputLine from './InputLine'
import MobileHints from './MobileHints'

const FORM_PROMPTS: Record<string, string> = {
  name:    'Elon Musk',
  email:   'hello@example.com',
  message: 'ウェブサイト制作の依頼をしたい...',
}

export default function Terminal({ bannerArt }: { bannerArt: string }) {
  const {
    history, inputValue, isBooting, contactForm, isFormActive,
    bootComplete, submitCommand, submitFormAnswer, cancelForm, setInputValue,
  } = useTerminal()
  const cmdHistory = useCommandHistory()
  const [focusTrigger, setFocusTrigger] = useState(0)

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (isFormActive) {
      submitFormAnswer(trimmed)
    } else {
      cmdHistory.push(trimmed)
      submitCommand(trimmed)
    }
  }, [isFormActive, submitFormAnswer, cmdHistory, submitCommand])

  const handleHistoryUp = useCallback((current: string) => cmdHistory.up(current), [cmdHistory])
  const handleHistoryDown = useCallback(() => cmdHistory.down(), [cmdHistory])

  function handleContainerClick() {
    setFocusTrigger(n => n + 1)
  }

  const promptLabel = isFormActive && contactForm
    ? FORM_PROMPTS[contactForm.step]
    : undefined

  return (
    <div className={styles.container} onClick={handleContainerClick}>
      {isBooting ? (
        <BootSequence onComplete={bootComplete} />
      ) : (
        <>
          <OutputHistory history={history} contactForm={contactForm} bannerArt={bannerArt} />
          <div className={styles.divider} />
          <InputLine
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            onHistoryUp={handleHistoryUp}
            onHistoryDown={handleHistoryDown}
            focusTrigger={focusTrigger}
            promptLabel={promptLabel}
            onCtrlC={isFormActive ? cancelForm : undefined}
          />
          <MobileHints onCommand={handleSubmit} isFormActive={isFormActive} onCancel={cancelForm} />
        </>
      )}
    </div>
  )
}
