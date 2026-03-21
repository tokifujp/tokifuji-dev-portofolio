export type KnownCommand =
  | '/help'
  | '/about'
  | '/services'
  | '/works'
  | '/contact'
  | '/terms'
  | '/privacy'
  | '/clear'

export type ContactFormStep =
  | 'name'
  | 'email'
  | 'message'
  | 'agree'
  | 'submitting'
  | 'done'
  | 'error'
  | 'cancelled'

export interface ContactFormState {
  step: ContactFormStep
  name: string
  email: string
  message: string
  error?: string
}

export type HistoryEntry =
  | { kind: 'echo';         id: string; text: string }
  | { kind: 'output';       id: string; command: KnownCommand }
  | { kind: 'contact-form'; id: string }
  | { kind: 'error';        id: string; text: string }
  | { kind: 'system';       id: string; lines: string[] }
  | { kind: 'banner';       id: string }

export interface CommandDefinition {
  command: KnownCommand
  description: string
  aliases: string[]
}

export interface WorkItem {
  title: string
  description: string
  url?: string
  tags: string[]
  year: number
}

export interface ServiceItem {
  name: string
  description: string
  price?: string
}
