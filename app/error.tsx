'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="text-sm font-medium text-primary hover:text-accent transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
