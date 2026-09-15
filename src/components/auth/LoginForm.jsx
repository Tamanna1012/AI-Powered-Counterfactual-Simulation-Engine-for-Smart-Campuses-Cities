import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, Wand2 } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { getRole } from '../../lib/roles'

export default function LoginForm({ role }) {
  const roleMeta = getRole(role)
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || roleMeta.dashboardPath

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in your email and password to continue.')
      return
    }
    if (mode === 'register' && !form.name) {
      setError('Please enter your full name to create an account.')
      return
    }
    setError('')
    login(role, { name: form.name, email: form.email })
    navigate(redirect, { replace: true })
  }

  function handleDemo() {
    login(role, {
      name: `Demo ${roleMeta.label}`,
      email: `demo.${role}@skillora.com`,
    })
    navigate(redirect, { replace: true })
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900">
        {mode === 'login' ? `${roleMeta.label} Sign In` : `Create ${roleMeta.label} Account`}
      </h1>
      <p className="mt-1.5 text-sm text-ink-500">
        {mode === 'login'
          ? `Welcome back! Sign in to access your ${roleMeta.label.toLowerCase()} dashboard.`
          : `Get started with your free ${roleMeta.label.toLowerCase()} account on Skillora.`}
      </p>

      <div className="mt-6 flex rounded-full bg-ink-100 p-1 text-sm font-semibold">
        <button
          className={`flex-1 rounded-full py-2 transition-colors ${mode === 'login' ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`flex-1 rounded-full py-2 transition-colors ${mode === 'register' ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'}`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'register' && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Full Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10.5 pr-3.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Email Address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10.5 pr-3.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10.5 pr-10.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" size="lg">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">or</span>
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <Button variant="outline" className="w-full" icon={Wand2} onClick={handleDemo}>
        Continue with Demo {roleMeta.label} Account
      </Button>
      <p className="mt-3 text-center text-xs text-ink-400">
        This is a prototype — any email &amp; password will sign you in instantly.
      </p>
    </div>
  )
}
