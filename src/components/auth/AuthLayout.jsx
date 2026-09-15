import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Logo from '../layout/Logo'

export default function AuthLayout({ icon: Icon, gradient, title, subtitle, highlights, children }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div
        className={`relative hidden flex-col justify-between overflow-hidden bg-linear-to-br ${gradient} p-10 text-white lg:flex`}
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <Logo dark className="relative z-10" />

        <div className="relative z-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Icon className="h-7 w-7" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-balance">{title}</h2>
          <p className="mt-3 max-w-sm text-white/80">{subtitle}</p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} Skillora Technologies Pvt. Ltd.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {children}
          <p className="mt-8 text-center text-sm text-ink-500">
            Not the right account type?{' '}
            <Link to="/" className="font-semibold text-brand-700 hover:underline">
              Go back home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
