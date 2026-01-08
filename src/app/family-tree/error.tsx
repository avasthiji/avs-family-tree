'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, TreePine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function FamilyTreeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Family tree error:', {
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
            <TreePine className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Family Tree Error</CardTitle>
          <CardDescription className="mt-2">
            Unable to load the family tree. This might be due to a network issue or data problem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>What happened?</AlertTitle>
            <AlertDescription>
              The family tree visualization encountered an error. This could be due to missing relationship data or a rendering issue.
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

