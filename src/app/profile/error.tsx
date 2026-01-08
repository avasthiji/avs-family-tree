'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Profile error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <User className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Profile Error</CardTitle>
          <CardDescription className="mt-2">
            Unable to load your profile. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>What happened?</AlertTitle>
            <AlertDescription>
              There was an error loading your profile information. This might be due to a network issue or data problem.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="flex items-center gap-2"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

