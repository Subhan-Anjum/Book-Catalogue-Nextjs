'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddBook() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required'
    }

    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to add book')
      }
    } catch (error) {
      console.error('Error adding book:', error)
      alert('Failed to add book')
    } finally {
      setIsSubmitting(false)
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

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="spinner-custom"></div>
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning-custom alert-custom">
          <i className="fas fa-lock me-2"></i>
          <strong>Authentication Required</strong>
          <p className="mb-2 mt-2">You need to be signed in to add books to your library.</p>
          <Link href="/auth/signin" className="btn btn-custom-primary">
            <i className="fas fa-sign-in-alt me-2"></i>Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Add New Book</h1>
        <p className="page-subtitle">Expand your digital library</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card card-custom">
            <div className="card-header-custom">
              <h3 className="mb-0">
                <i className="fas fa-book-medical me-2"></i>
                Book Details
              </h3>
            </div>
            <div className="card-body-custom">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label form-label-custom">
                    <i className="fas fa-heading me-2"></i>Book Title *
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-custom ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter the book title"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.title}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="author" className="form-label form-label-custom">
                    <i className="fas fa-user-edit me-2"></i>Author *
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-custom ${errors.author ? 'is-invalid' : ''}`}
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter the author's name"
                  />
                  {errors.author && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.author}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="genre" className="form-label form-label-custom">
                    <i className="fas fa-tags me-2"></i>Genre *
                  </label>
                  <select
                    className={`form-control form-control-custom ${errors.genre ? 'is-invalid' : ''}`}
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                  >
                    <option value="">Select a genre</option>
                    <option value="Fiction">📖 Fiction</option>
                    <option value="Non-Fiction">📚 Non-Fiction</option>
                    <option value="Mystery">🔍 Mystery</option>
                    <option value="Romance">💕 Romance</option>
                    <option value="Science Fiction">🚀 Science Fiction</option>
                    <option value="Fantasy">🧙‍♂️ Fantasy</option>
                    <option value="Biography">👤 Biography</option>
                    <option value="History">🏛️ History</option>
                    <option value="Self-Help">💪 Self-Help</option>
                    <option value="Business">💼 Business</option>
                    <option value="Technology">💻 Technology</option>
                    <option value="Other">📋 Other</option>
                  </select>
                  {errors.genre && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.genre}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-3 justify-content-end">
                  <Link href="/" className="btn btn-custom-secondary">
                    <i className="fas fa-arrow-left me-2"></i>Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-custom-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Adding Book...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>Add to Library
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
