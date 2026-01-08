'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <html lang="en">
      <head>
        <title>Error - AVS Family Tree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50 lg:bg-white flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Critical Error</CardTitle>
              <CardDescription className="mt-2">
                A critical error occurred that prevented the application from loading. Please try again or contact support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDevelopment && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Development Error Details</AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="space-y-2">
                      <p className="font-mono text-xs break-all">
                        <strong>Message:</strong> {error.message}
                      </p>
                      {error.digest && (
                        <p className="font-mono text-xs">
                          <strong>Digest:</strong> {error.digest}
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {!isDevelopment && error.digest && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error Reference</AlertTitle>
                  <AlertDescription>
                    If this problem persists, please contact support with this reference: <code className="font-mono text-xs">{error.digest}</code>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={reset}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Go home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}

