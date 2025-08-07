'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  useEffect(() => {
    if (!email) {
      router.push('/auth/signin')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, router])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Email verified successfully! Signing you in...')
        
        const result = await signIn('credentials', {
          email: data.email,
          password: data.tempPassword,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/')
        } else {
          setError('Account created but sign in failed. Please try signing in manually.')
        }
      } else {
        setError(data.error || 'Invalid or expired OTP')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSuccess('New verification code sent to your email!')
        setTimeLeft(600)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setError('Failed to resend OTP')
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="fade-in-up">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card card-custom">
            <div className="card-header-custom text-center">
              <h2 className="mb-0">
                <i className="fas fa-envelope-open-text me-2"></i>
                Verify Your Email
              </h2>
              <p className="mb-0 mt-2 opacity-75">
                We've sent a verification code to your email
              </p>
            </div>
            <div className="card-body-custom">
              <div className="text-center mb-4">
                <div className="bg-light rounded-3 p-3 mb-3">
                  <i className="fas fa-envelope text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                  <p className="mb-1 fw-bold">{email}</p>
                  <p className="text-muted small mb-0">Check your inbox for the 6-digit code</p>
                </div>
                
                <div className="timer-display">
                  <i className="fas fa-clock me-2"></i>
                  {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : 'Code Expired'}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger-custom alert-custom mb-4" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success-custom alert-custom mb-4" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleVerifyOTP}>
                <div className="mb-4">
                  <label htmlFor="otp" className="form-label form-label-custom text-center d-block">
                    <i className="fas fa-key me-2"></i>Enter Verification Code
                  </label>
                  <input
                    type="text"
                    className="form-control otp-input"
                    id="otp"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtp(value)
                      setError('')
                    }}
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>

                <div className="d-grid mb-4">
                  <button
                    type="submit"
                    className="btn btn-custom-success"
                    disabled={isVerifying || otp.length !== 6 || timeLeft === 0}
                  >
                    {isVerifying ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>Verify & Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mb-4">
                <p className="text-muted mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  className="btn btn-custom-secondary btn-sm"
                  onClick={handleResendOTP}
                  disabled={isResending || timeLeft > 540}
                >
                  {isResending ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Resending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-redo me-2"></i>Resend Code
                    </>
                  )}
                </button>
                {timeLeft > 540 && (
                  <p className="text-muted small mt-2">
                    You can resend in {formatTime(timeLeft - 540)}
                  </p>
                )}
              </div>

              <div className="text-center">
                <Link href="/auth/signin" className="btn btn-custom-secondary btn-sm">
                  <i className="fas fa-arrow-left me-2"></i>Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
