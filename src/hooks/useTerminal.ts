'use client'

import { useReducer, useCallback } from 'react'
import type { HistoryEntry, KnownCommand, ContactFormState, ContactFormStep } from '@/types/terminal'
import { resolveCommand } from '@/lib/commands'

type State = {
  history: HistoryEntry[]
  inputValue: string
  isBooting: boolean
  contactForm: ContactFormState | null
}

type Action =
  | { type: 'BOOT_COMPLETE' }
  | { type: 'SUBMIT_COMMAND'; raw: string }
  | { type: 'CLEAR' }
  | { type: 'SET_INPUT'; value: string }
  | { type: 'FORM_ANSWER'; answer: string }
  | { type: 'FORM_STATUS'; step: ContactFormStep; error?: string }

function uid(): string {
  return Math.random().toString(36).slice(2)
}

const FORM_STEP_ORDER: ContactFormStep[] = ['name', 'email', 'message', 'agree']

function nextFormStep(current: ContactFormStep): ContactFormStep {
  const idx = FORM_STEP_ORDER.indexOf(current)
  return idx >= 0 && idx < FORM_STEP_ORDER.length - 1
    ? FORM_STEP_ORDER[idx + 1]
    : 'submitting'
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BOOT_COMPLETE':
      return {
        ...state,
        isBooting: false,
        history: [
          { kind: 'banner', id: uid() },
          { kind: 'system', id: uid(), lines: ['Type /help to see available commands.'] },
        ],
      }

    case 'SUBMIT_COMMAND': {
      const raw = action.raw.trim()
      if (!raw) return state

      const echoEntry: HistoryEntry = { kind: 'echo', id: uid(), text: raw }
      const cmd = resolveCommand(raw)

      if (cmd === '/clear') {
        return {
          ...state,
          inputValue: '',
          contactForm: null,
          history: [
            { kind: 'banner', id: uid() },
            { kind: 'system', id: uid(), lines: ['Type /help to see available commands.'] },
          ],
        }
      }

      if (!cmd) {
        return {
          ...state,
          inputValue: '',
          history: [
            ...state.history,
            echoEntry,
            { kind: 'error', id: uid(), text: `command not found: ${raw}. Try /help` },
          ],
        }
      }

      if (cmd === '/contact') {
        return {
          ...state,
          inputValue: '',
          history: [
            ...state.history,
            echoEntry,
            { kind: 'contact-form', id: uid() },
          ],
          contactForm: { step: 'name', name: '', email: '', message: '' },
        }
      }

      return {
        ...state,
        inputValue: '',
        history: [
          ...state.history,
          echoEntry,
          { kind: 'output', id: uid(), command: cmd as KnownCommand },
        ],
      }
    }

    case 'FORM_ANSWER': {
      if (!state.contactForm) return state
      const { step } = state.contactForm
      if (!FORM_STEP_ORDER.includes(step as ContactFormStep)) return state

      const updated = {
        ...state.contactForm,
        [step]: action.answer,
        step: nextFormStep(step),
      }
      return { ...state, inputValue: '', contactForm: updated }
    }

    case 'FORM_STATUS':
      if (!state.contactForm) return state
      return {
        ...state,
        contactForm: { ...state.contactForm, step: action.step, error: action.error },
      }

    case 'CLEAR':
      return { ...state, history: [], contactForm: null }

    case 'SET_INPUT':
      return { ...state, inputValue: action.value }

    default:
      return state
  }
}

export function useTerminal() {
  const [state, dispatch] = useReducer(reducer, {
    history: [],
    inputValue: '',
    isBooting: true,
    contactForm: null,
  })

  const bootComplete  = useCallback(() => dispatch({ type: 'BOOT_COMPLETE' }), [])
  const clearHistory  = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const setInputValue = useCallback((value: string) => dispatch({ type: 'SET_INPUT', value }), [])
  const cancelForm    = useCallback(() => dispatch({ type: 'FORM_STATUS', step: 'cancelled' }), [])

  const submitCommand = useCallback((raw: string) => {
    dispatch({ type: 'SUBMIT_COMMAND', raw })
  }, [])

  const submitFormAnswer = useCallback(async (answer: string) => {
    const trimmed = answer.trim()
    if (!trimmed || !state.contactForm) return

    const { step, name, email } = state.contactForm

    // Basic email validation
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (step === 'email' && !EMAIL_RE.test(trimmed)) {
      dispatch({ type: 'FORM_STATUS', step: 'email', error: 'Invalid email address.' })
      return
    }

    // Agree step: y to submit, anything else to cancel (no FORM_ANSWER dispatch)
    if (step === 'agree') {
      if (trimmed.toLowerCase() === 'y') {
        dispatch({ type: 'FORM_STATUS', step: 'submitting' })
        try {
          const { name: n, email: e, message: m } = state.contactForm
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: n, email: e, message: m }),
          })
          if (!res.ok) throw new Error('server error')
          dispatch({ type: 'FORM_STATUS', step: 'done' })
        } catch {
          dispatch({ type: 'FORM_STATUS', step: 'error', error: 'Failed to send. Please try again later.' })
        }
      } else {
        dispatch({ type: 'FORM_STATUS', step: 'cancelled' })
      }
      return
    }

    dispatch({ type: 'FORM_ANSWER', answer: trimmed })
  }, [state.contactForm])

  const isFormActive =
    state.contactForm !== null &&
    ['name', 'email', 'message', 'agree'].includes(state.contactForm.step)

  return {
    ...state,
    isFormActive,
    bootComplete,
    submitCommand,
    submitFormAnswer,
    cancelForm,
    clearHistory,
    setInputValue,
  }
}
