'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      if (showSignUp) {
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`)
        } else {
          const errorData = await response.json()
          setErrors({ general: errorData.error || 'Failed to send OTP' })
        }
      } else {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/')
        } else {
          setErrors({ general: 'Invalid email or password' })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google sign in error:', error)
      setErrors({ general: 'Failed to sign in with Google' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="fade-in-up">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card card-custom">
            <div className="card-header-custom text-center">
              <h2 className="mb-0">
                {showSignUp ? (
                  <>
                    <i className="fas fa-user-plus me-2"></i>Create Account
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>Welcome Back
                  </>
                )}
              </h2>
              <p className="mb-0 mt-2 opacity-75">
                {showSignUp ? 'Join BookVault today' : 'Sign in to your account'}
              </p>
            </div>
            <div className="card-body-custom">
              {errors.general && (
                <div className="alert alert-danger-custom alert-custom mb-4" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {showSignUp && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label form-label-custom">
                      <i className="fas fa-user me-2"></i>Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label form-label-custom">
                    <i className="fas fa-envelope me-2"></i>Email Address *
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-custom"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label form-label-custom">
                    <i className="fas fa-lock me-2"></i>Password *
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-custom"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  {showSignUp && (
                    <div className="form-text text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      Password should be at least 6 characters long
                    </div>
                  )}
                </div>

                <div className="d-grid mb-4">
                  <button
                    type="submit"
                    className="btn btn-custom-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        {showSignUp ? 'Sending OTP...' : 'Signing In...'}
                      </>
                    ) : (
                      showSignUp ? (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>Send Verification Code
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>Sign In
                        </>
                      )
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mb-4">
                <span className="text-muted">or continue with</span>
              </div>

              <div className="d-grid mb-4">
                <button
                  type="button"
                  className="btn btn-google"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={() => setShowSignUp(!showSignUp)}
                >
                  {showSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"
                  }
                </button>
              </div>

              <div className="text-center mt-3">
                <Link href="/" className="btn btn-custom-secondary btn-sm">
                  <i className="fas fa-arrow-left me-2"></i>Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
