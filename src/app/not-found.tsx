'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to home page
    router.push('/')
  }, [router])

  // Return null while redirecting
  return null
}
