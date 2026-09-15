import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  Users2,
  X,
} from 'lucide-react'
import Logo from './Logo'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { roles } from '../../lib/roles'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/courses', label: 'Courses' },
  { to: '/notes', label: 'Notes' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/contact', label: 'Contact' },
]

const roleIcons = { student: GraduationCap, teacher: Users2, associate: UserCog }

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const signInRef = useRef(null)
  const userMenuRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onClick(e) {
      if (signInRef.current && !signInRef.current.contains(e.target)) setSignInOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleLogout() {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const roleMeta = user ? roles.find((r) => r.id === user.role) : null

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/85 shadow-soft backdrop-blur-lg' : 'bg-white/60 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <div className="relative" ref={signInRef}>
              <Button
                variant="outline"
                size="sm"
                icon={ChevronDown}
                onClick={() => setSignInOpen((v) => !v)}
                aria-expanded={signInOpen}
              >
                Sign In
              </Button>
              {signInOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-ink-100 bg-white p-2 shadow-lift animate-fade-up">
                  <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Continue as
                  </p>
                  {roles.map((role) => {
                    const Icon = roleIcons[role.id]
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          setSignInOpen(false)
                          navigate(role.loginPath)
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand-50"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink-900">
                            {role.label}
                          </span>
                          <span className="block text-xs text-ink-500">{role.description}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:border-brand-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {user.initials}
                </span>
                <span className="text-sm font-medium text-ink-800">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-ink-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-ink-100 bg-white p-2 shadow-lift animate-fade-up">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="text-xs capitalize text-ink-500">{roleMeta?.label} account</p>
                  </div>
                  <div className="my-1 h-px bg-ink-100" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      navigate(roleMeta?.dashboardPath || '/')
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <Button to="/courses" variant="primary" size="sm">
            Explore Courses
          </Button>
        </div>

        <button
          className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-5 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 border-t border-ink-100 pt-4">
            {!user ? (
              <>
                <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Sign in as
                </p>
                <div className="flex flex-col gap-2">
                  {roles.map((role) => (
                    <Button
                      key={role.id}
                      to={role.loginPath}
                      variant="outline"
                      className="justify-start"
                      onClick={() => setMobileOpen(false)}
                    >
                      {role.label}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  to={roleMeta?.dashboardPath || '/'}
                  variant="outline"
                  onClick={() => setMobileOpen(false)}
                >
                  Go to Dashboard
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
            <Button to="/courses" variant="primary" className="mt-3 w-full" onClick={() => setMobileOpen(false)}>
              Explore Courses
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
