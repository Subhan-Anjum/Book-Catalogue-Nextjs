# 📚 Book Catalog App with Email OTP Verification

A full-stack book catalog application built with Next.js, PostgreSQL, Prisma, and NextAuth.js. Features secure email OTP verification for user registration and Google OAuth sign-in.

## 🚀 Features

- **Email OTP Verification**: Secure signup process with email verification
- **User Authentication**: Email/password and Google OAuth sign-in
- **Book Management**: Add, view, and delete books
- **Responsive Design**: Bootstrap-powered responsive UI
- **Secure**: Server-side authentication and authorization
- **Database**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Bootstrap 5
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Email**: Nodemailer
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon, Supabase, or local)
- Email service (Gmail with App Password recommended)
- Google OAuth credentials (optional)

## 🔧 Local Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd book-catalog-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   DATABASE_URL="postgresql://username:password@host:5432/database"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email Configuration (Gmail example)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="your-email@gmail.com"
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   \`\`\`

4. **Set up Gmail App Password (for email OTP)**
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password for "Mail"
   - Use this App Password in SMTP_PASS

5. **Set up the database**
   \`\`\`bash
   npx prisma db push
   npx prisma generate
   \`\`\`

6. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 Email OTP Flow

1. **Sign Up**: User enters name, email, and password
2. **OTP Sent**: 6-digit OTP sent to user's email
3. **Verification**: User enters OTP on verification page
4. **Account Created**: Account created and user automatically signed in
5. **Resend Option**: Users can resend OTP if needed

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables for Vercel**
   \`\`\`
   DATABASE_URL=your-production-database-url
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   \`\`\`

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Fetch all user's books |
| POST | `/api/books` | Add a new book |
| DELETE | `/api/books?id={id}` | Delete a book |
| POST | `/api/auth/send-otp` | Send OTP for signup |
| POST | `/api/auth/verify-otp` | Verify OTP and create account |
| POST | `/api/auth/resend-otp` | Resend OTP |

## 🔐 Authentication Flow

### Email/Password Signup with OTP
1. **Sign Up Form**: User enters name, email, password
2. **OTP Generation**: System generates 6-digit OTP
3. **Email Sent**: OTP sent to user's email
4. **OTP Verification**: User enters OTP (10-minute expiry)
5. **Account Creation**: Account created and user signed in
6. **Resend Option**: Users can resend OTP after 1 minute

### Sign In
1. **Email/Password**: Direct sign-in for existing users
2. **Google OAuth**: One-click Google sign-in

## 📊 Database Schema

### Users Table
- id, name, email, password, emailVerified, image
- Linked to accounts, sessions, and books

### Books Table  
- id, title, author, genre, userId
- Belongs to authenticated user

### EmailOTP Table
- id, email, otp, name, password, expires, verified
- Temporary storage for OTP verification

### Auth Tables
- accounts, sessions, verification_tokens (NextAuth.js)

## 🎨 UI Components

- **Responsive Navbar**: Bootstrap navigation with user menu
- **Book Cards**: Grid layout with hover effects
- **Forms**: Validated forms with error handling
- **OTP Verification**: Dedicated OTP input with timer
- **Loading States**: Spinners and disabled states

## 🔒 Security Features

- Email OTP verification (6-digit, 10-minute expiry)
- Password hashing with bcryptjs
- JWT session tokens
- CSRF protection
- Input validation and sanitization
- Protected API routes
- User-specific data isolation
- Rate limiting on OTP requests

## 📝 Features Implemented

✅ Email OTP verification for signup  
✅ User authentication (email/password + Google)  
✅ CRUD operations for books  
✅ Responsive Bootstrap UI  
✅ Form validation  
✅ Loading states and error handling  
✅ Protected routes  
✅ Database integration with Prisma  
✅ Email service integration  
✅ OTP resend functionality  
✅ Deployment ready  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
