'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import BookCard from './components/BookCard'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session) {
      fetchBooks()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books')
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        setError('Failed to fetch books')
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      setError('Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const handleBookDelete = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="loading-container">
        <div className="spinner-custom"></div>
        <p className="mt-3 text-muted">Loading your library...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="fade-in-up">
        <div className="welcome-section">
          <div className="welcome-title">
            📚 Welcome to BookVault
          </div>
          <p className="welcome-subtitle">
            Your personal digital library awaits. Organize, discover, and manage your book collection with elegance and ease.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/auth/signin" className="btn btn-custom-primary">
              <i className="fas fa-sign-in-alt me-2"></i>
              Get Started
            </Link>
            <button className="btn btn-custom-secondary">
              <i className="fas fa-info-circle me-2"></i>
              Learn More
            </button>
          </div>
        </div>
        
        <div className="row mt-5">
          <div className="col-md-4 mb-4">
            <div className="card card-custom text-center">
              <div className="card-body-custom">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                  <i className="fas fa-book-open"></i>
                </div>
                <h5 className="fw-bold">Organize</h5>
                <p className="text-muted">Keep your books organized with our intuitive catalog system</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card card-custom text-center">
              <div className="card-body-custom">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                  <i className="fas fa-search"></i>
                </div>
                <h5 className="fw-bold">Discover</h5>
                <p className="text-muted">Find your next great read with smart recommendations</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card card-custom text-center">
              <div className="card-body-custom">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                  <i className="fas fa-chart-line"></i>
                </div>
                <h5 className="fw-bold">Track</h5>
                <p className="text-muted">Monitor your reading progress and build reading habits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">My Library</h1>
        <p className="page-subtitle">
          {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <button className="btn btn-custom-secondary">
            <i className="fas fa-filter me-2"></i>Filter
          </button>
          <button className="btn btn-custom-secondary">
            <i className="fas fa-sort me-2"></i>Sort
          </button>
        </div>
        <Link href="/add" className="btn btn-custom-success">
          <i className="fas fa-plus me-2"></i>Add New Book
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger-custom alert-custom mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">Your library is empty</h3>
          <p className="empty-state-text">
            Start building your collection by adding your first book!
          </p>
          <Link href="/add" className="btn btn-custom-primary">
            <i className="fas fa-plus me-2"></i>Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="row">
          {books.map((book, index) => (
            <div key={book.id} className="col-lg-4 col-md-6 mb-4">
              <div style={{ animationDelay: `${index * 0.1}s` }} className="slide-in-right">
                <BookCard 
                  book={book} 
                  onDelete={handleBookDelete}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
