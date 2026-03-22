'use client'

import { useEffect, useRef } from 'react'
import type { HistoryEntry, ContactFormState, WorkItem } from '@/types/terminal'
import styles from './OutputHistory.module.css'
import HelpOutput from '@/components/outputs/HelpOutput'
import AboutOutput from '@/components/outputs/AboutOutput'
import ServicesOutput from '@/components/outputs/ServicesOutput'
import WorksOutput from '@/components/outputs/WorksOutput'
import ContactOutput from '@/components/outputs/ContactOutput'
import TermsOutput from '@/components/outputs/TermsOutput'
import PrivacyOutput from '@/components/outputs/PrivacyOutput'

interface Props {
  history: HistoryEntry[]
  contactForm: ContactFormState | null
  bannerArt: string
  works: WorkItem[]
}

function OutputBlock({ entry, contactForm, bannerArt, works }: { entry: HistoryEntry; contactForm: ContactFormState | null; bannerArt: string; works: WorkItem[] }) {
  if (entry.kind === 'banner') {
    return (
      <div className={styles.bannerWrapper}>
        <pre className={styles.banner}>{bannerArt}</pre>
      </div>
    )
  }
  if (entry.kind === 'echo') {
    return <div className={styles.echo}>{entry.text}</div>
  }
  if (entry.kind === 'error') {
    return <div className={styles.errorLine}>{entry.text}</div>
  }
  if (entry.kind === 'system') {
    return (
      <div>
        {entry.lines.map((line, i) => (
          <div key={i} className={styles.systemLine}>{line}</div>
        ))}
      </div>
    )
  }
  if (entry.kind === 'contact-form') {
    if (!contactForm) return null
    return <ContactOutput form={contactForm} />
  }
  if (entry.kind === 'output') {
    switch (entry.command) {
      case '/help':     return <HelpOutput />
      case '/about':    return <AboutOutput />
      case '/services': return <ServicesOutput />
      case '/works':    return <WorksOutput works={works} />
      case '/contact':  return null  // handled by contact-form entry
      case '/terms':    return <TermsOutput />
      case '/privacy':  return <PrivacyOutput />
      default:          return null
    }
  }
  return null
}

export default function OutputHistory({ history, contactForm, bannerArt, works }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sentinelRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, contactForm])

  return (
    <div className={styles.history}>
      {history.map(entry => (
        <div key={entry.id} className={styles.entry}>
          <OutputBlock entry={entry} contactForm={contactForm} bannerArt={bannerArt} works={works} />
        </div>
      ))}
      <div ref={sentinelRef} className={styles.sentinel} />
    </div>
  )
}
