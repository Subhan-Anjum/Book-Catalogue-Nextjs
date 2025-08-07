'use client'

import { useState } from 'react'

export default function BookCard({ book, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this book from your library?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/books?id=${book.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(book.id)
      } else {
        alert('Failed to delete book')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('Failed to delete book')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="book-card">
      <div className="book-card-header">
        <h5 className="book-title">{book.title}</h5>
        <div className="book-genre">{book.genre}</div>
      </div>
      <div className="book-card-body">
        <div className="book-meta">
          <strong>Author:</strong> {book.author}
        </div>
        <div className="book-meta">
          <strong>Added:</strong> {new Date(book.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-custom-secondary btn-sm">
            <i className="fas fa-eye me-1"></i>View
          </button>
          <button
            className="btn btn-custom-danger btn-sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Removing...
              </>
            ) : (
              <>
                <i className="fas fa-trash me-1"></i>Remove
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
