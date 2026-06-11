import { NextRequest, NextResponse } from 'next/server'
import { createLead, createNotification } from '@/lib/firestore'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message, plan, source } = body

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
    }

    // Save lead to Firestore
    await createLead({
      name,
      email: email || '',
      phone: phone || '',
      message,
      plan: plan || '',
      source: source || 'website',
      status: 'new',
    })

    // Create notification for admin
    await createNotification({
      title: 'New Contact Form Submission',
      message: `${name} sent a message${plan ? ` about ${plan}` : ''}`,
      type: 'contact',
      read: false,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
