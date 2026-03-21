import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const { name, email, message } = await req.json()
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

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
