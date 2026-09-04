import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

// Simple in-memory store for demo (replace with database in production)
// This provides a working API without external dependencies
const subscribers = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check for existing subscription
    const normalizedEmail = email.toLowerCase().trim()
    if (subscribers.has(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      )
    }

    // Option 1: Resend integration (uncomment when ready)
    // Requires: npm install resend && RESEND_API_KEY in env
    /*
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      // Add to Resend audience
      await resend.contacts.create({
        email: normalizedEmail,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      })
    }
    */

    // Option 2: ConvertKit integration (uncomment when ready)
    // Requires: CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID in env
    /*
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          email: normalizedEmail,
        }),
      })
    }
    */

    // Option 3: Buttondown integration (uncomment when ready)
    // Requires: BUTTONDOWN_API_KEY in env
    /*
    if (process.env.BUTTONDOWN_API_KEY) {
      await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.BUTTONDOWN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })
    }
    */

    // For now, store in memory (resets on server restart)
    // In production, use one of the integrations above or store in database
    subscribers.add(normalizedEmail)

    // Log for verification (visible in server logs)
    logger.log(`[Newsletter] New subscriber: ${normalizedEmail}`)

    return NextResponse.json(
      { message: 'Successfully subscribed', email: normalizedEmail },
      { status: 201 }
    )
  } catch (error) {
    logger.error('[Newsletter] Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check subscription status (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ count: subscribers.size }, { status: 200 })
  }

  const normalizedEmail = email.toLowerCase().trim()
  return NextResponse.json(
    { subscribed: subscribers.has(normalizedEmail) },
    { status: 200 }
  )
}
