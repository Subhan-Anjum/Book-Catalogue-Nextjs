import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTPEmail } from '@/lib/email'

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find existing OTP record
    const existingOTP = await prisma.emailOTP.findFirst({
      where: {
        email,
        verified: false
      }
    })

    if (!existingOTP) {
      return NextResponse.json(
        { error: 'No pending verification found for this email' },
        { status: 400 }
      )
    }

    // Generate new OTP
    const newOTP = generateOTP()

    // Update OTP record
    await prisma.emailOTP.update({
      where: {
        id: existingOTP.id
      },
      data: {
        otp: newOTP,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      }
    })

    // Send new OTP email
    const emailResult = await sendOTPEmail(email, newOTP, existingOTP.name)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'New OTP sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
