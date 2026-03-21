import { useRef } from 'react'

export function useCommandHistory() {
  const history = useRef<string[]>([])
  const index = useRef<number>(-1)

  function push(cmd: string) {
    if (cmd && cmd !== history.current[0]) {
      history.current = [cmd, ...history.current].slice(0, 100)
    }
    index.current = -1
  }

  function up(currentInput: string): string {
    if (history.current.length === 0) return currentInput
    const next = Math.min(index.current + 1, history.current.length - 1)
    index.current = next
    return history.current[next]
  }

  function down(): string {
    if (index.current <= 0) {
      index.current = -1
      return ''
    }
    index.current -= 1
    return history.current[index.current]
  }

  function reset() {
    index.current = -1
  }

  return { push, up, down, reset }
}
