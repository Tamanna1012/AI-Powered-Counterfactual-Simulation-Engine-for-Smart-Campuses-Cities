import { ArrowLeft, SearchX } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <SearchX className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button to="/" className="mt-8" icon={ArrowLeft} iconPosition="left">
        Back to Home
      </Button>
    </div>
  )
}
