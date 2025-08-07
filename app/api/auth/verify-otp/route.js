import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find OTP record
    const otpRecord = await prisma.emailOTP.findFirst({
      where: {
        email,
        otp,
        verified: false,
        expires: {
          gt: new Date()
        }
      }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Create user account
    const user = await prisma.user.create({
      data: {
        name: otpRecord.name,
        email: otpRecord.email,
        password: otpRecord.password,
        emailVerified: new Date(),
      }
    })

    // Mark OTP as verified and delete it
    await prisma.emailOTP.delete({
      where: {
        id: otpRecord.id
      }
    })

    return NextResponse.json(
      { 
        message: 'Email verified successfully',
        email: user.email,
        tempPassword: 'verified' // Just a flag for auto sign-in
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
