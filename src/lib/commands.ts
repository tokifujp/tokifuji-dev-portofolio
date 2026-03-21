import type { CommandDefinition, KnownCommand } from '@/types/terminal'

export const COMMANDS: CommandDefinition[] = [
  { command: '/help',     description: '利用可能なコマンドを表示',   aliases: ['help', 'h', '?'] },
  { command: '/about',    description: '自己紹介・プロフィール',       aliases: ['about', 'who', 'whoami'] },
  { command: '/services', description: '提供サービス一覧',             aliases: ['services', 'svc', 'service'] },
  { command: '/works',    description: '制作実績・ポートフォリオ',     aliases: ['works', 'portfolio', 'work'] },
  { command: '/contact',  description: 'お問い合わせ・連絡先',         aliases: ['contact', 'email'] },
  { command: '/terms',    description: '利用規約',                      aliases: ['terms', 'tos'] },
  { command: '/privacy',  description: 'プライバシーポリシー',          aliases: ['privacy', 'pp'] },
  { command: '/clear',    description: '画面をクリア',                  aliases: ['clear', 'cls'] },
]

const COMMAND_MAP: Map<string, KnownCommand> = new Map()
for (const def of COMMANDS) {
  COMMAND_MAP.set(def.command, def.command)
  for (const alias of def.aliases) {
    COMMAND_MAP.set(alias, def.command)
    COMMAND_MAP.set('/' + alias, def.command)
  }
}

export function resolveCommand(input: string): KnownCommand | null {
  const trimmed = input.trim().toLowerCase()
  return COMMAND_MAP.get(trimmed) ?? null
}

export function getSuggestion(input: string): string | null {
  if (!input.startsWith('/') || input.length < 2) return null
  const lower = input.toLowerCase()
  for (const def of COMMANDS) {
    if (def.command.startsWith(lower) && def.command !== lower) {
      return def.command.slice(input.length)
    }
  }
  return null
}
