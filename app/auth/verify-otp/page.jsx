// app/auth/verify-otp/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the client component
const VerifyOTPForm = dynamic(() => import('../../components/VerifyOTPForm'), { ssr: false })

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPForm />
    </Suspense>
  )
}
