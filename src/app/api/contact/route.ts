import { NextRequest, NextResponse } from 'next/server'

// ── レートリミット（インメモリ、IP ベース）──
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 60 * 1000 // 1 時間

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ── 定数 ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DISCORD_WEBHOOK_RE = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/

export async function POST(req: NextRequest) {
  // 1. Webhook URL 検証
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl || !DISCORD_WEBHOOK_RE.test(webhookUrl)) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  // 2. レートリミット
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // 3. 入力パース & バリデーション
  const body = await req.json()
  const { name, email, message } = body

  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  // 4. Discord Webhook POST
  const payload = {
    embeds: [
      {
        title: '📬 New Contact',
        color: 0x00e5a0,
        fields: [
          { name: 'Name',    value: String(name),    inline: true },
          { name: 'Email',   value: String(email),   inline: true },
          { name: 'Message', value: String(message) },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Webhook failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
