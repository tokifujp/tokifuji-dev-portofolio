import type { ContactFormState } from '@/types/terminal'
import styles from './output.module.css'
import contactStyles from './ContactOutput.module.css'

const STEPS = [
  { key: 'name' as const,    question: 'name?',    placeholder: 'Elon Musk' },
  { key: 'email' as const,   question: 'email?',   placeholder: 'hello@example.com' },
  { key: 'message' as const, question: 'message?', placeholder: 'ウェブサイト制作の依頼をしたい...' },
]

const AGREE_OR_LATER = ['agree', 'submitting', 'done', 'error', 'cancelled']

interface Props {
  form: ContactFormState
}

export default function ContactOutput({ form }: Props) {
  const currentStepIndex = AGREE_OR_LATER.includes(form.step)
    ? STEPS.length
    : STEPS.findIndex(s => s.key === form.step)

  return (
    <div className={styles.block}>
      <div className={styles.header}>Contact</div>

      {STEPS.map((stepDef, i) => {
        const isAnswered = i < currentStepIndex
        const isActive   = i === currentStepIndex
        const answer     = form[stepDef.key]

        if (!isAnswered && !isActive) return null

        return (
          <div key={stepDef.key} className={contactStyles.stepBlock} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={contactStyles.question}>{stepDef.question}</div>
            {isAnswered && (
              <div className={contactStyles.answerLine}>
                <span className={contactStyles.placeholder}>{stepDef.placeholder}</span>
                <span className={contactStyles.arrow}> &gt; </span>
                <span className={contactStyles.answer}>{answer}</span>
              </div>
            )}
          </div>
        )
      })}

      {AGREE_OR_LATER.includes(form.step) && (
        <div className={contactStyles.stepBlock} style={{ animationDelay: `${STEPS.length * 80}ms` }}>
          <div className={contactStyles.agreeContext}>
            利用規約とプライバシーポリシーに同意しますか？{' '}
            <span className={contactStyles.hint}>(/terms, /privacy で確認できます)</span>
          </div>
          <div className={contactStyles.question}>同意しますか？ (y/N)</div>
          {form.step !== 'agree' && (
            <div className={contactStyles.answerLine}>
              <span className={contactStyles.placeholder}>N</span>
              <span className={contactStyles.arrow}> &gt; </span>
              <span className={contactStyles.answer}>
                {['submitting', 'done', 'error'].includes(form.step) ? 'y' : 'n'}
              </span>
            </div>
          )}
        </div>
      )}

      {form.step === 'submitting' && (
        <div className={contactStyles.status}>Sending...</div>
      )}
      {form.step === 'done' && (
        <div className={contactStyles.success}>✓ Message sent. I&apos;ll get back to you soon.</div>
      )}
      {form.step === 'error' && (
        <div className={contactStyles.errorMsg}>✗ {form.error}</div>
      )}
      {form.step === 'cancelled' && (
        <div className={contactStyles.cancelled}>
          送信をキャンセルしました。再度お問い合わせの際は /contact をご利用ください。
        </div>
      )}
    </div>
  )
}
