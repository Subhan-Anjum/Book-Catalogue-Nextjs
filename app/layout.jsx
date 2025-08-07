import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { AuthProvider } from './components/AuthProvider'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BookVault - Your Personal Library',
  description: 'A professional book catalog application for managing your personal library',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <div style={{ paddingTop: '80px' }}>
            <div className="main-container">
              <div className="container">
                {children}
              </div>
            </div>
          </div>
        </AuthProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  )
}
