import { Link } from 'react-router-dom'
import { Sparkle } from 'lucide-react'

export default function Logo({ dark = false, className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-lift">
        <Sparkle className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span
        className={`font-display text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}
      >
        Skillora
      </span>
    </Link>
  )
}
