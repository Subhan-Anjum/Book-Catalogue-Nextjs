'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" href="/">
          📚 BookVault
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ boxShadow: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" href="/">
                <i className="fas fa-home me-2"></i>Home
              </Link>
            </li>
            {session && (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" href="/add">
                  <i className="fas fa-plus me-2"></i>Add Book
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {status === 'loading' ? (
              <li className="nav-item">
                <span className="nav-link">
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                </span>
              </li>
            ) : session ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link nav-link-custom dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                  </div>
                  {session.user?.name || session.user?.email}
                </a>
                <ul className="dropdown-menu dropdown-menu-custom">
                  <li>
                    <button 
                      className="dropdown-item dropdown-item-custom" 
                      onClick={() => signOut()}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" href="/auth/signin">
                  <i className="fas fa-sign-in-alt me-2"></i>Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
