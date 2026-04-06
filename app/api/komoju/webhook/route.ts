import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-komoju-signature')
    const webhookSecret = process.env.KOMOJU_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('Komoju webhook: KOMOJU_WEBHOOK_SECRET not set')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    if (!signature) {
      console.error('Komoju webhook: missing signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }
    const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')
    const expectedBuf = Buffer.from(expected, 'hex')
    const signatureBuf = Buffer.from(signature, 'hex')
    const valid = expectedBuf.length === signatureBuf.length &&
      crypto.timingSafeEqual(expectedBuf, signatureBuf)
    if (!valid) {
      console.error('Komoju webhook: invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    switch (event.type) {
      case 'payment.captured':
        console.log('Payment captured:', event.data?.object?.id)
        break
      case 'payment.failed':
        console.log('Payment failed:', event.data?.object?.id)
        break
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch {
    console.error('Komoju webhook error')
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

