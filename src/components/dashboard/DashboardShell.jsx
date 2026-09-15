import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function DashboardShell({ roleLabel, navItems, activeTab, onTabChange, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-base font-semibold text-white">
                {user?.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
                <p className="text-xs capitalize text-ink-500">{roleLabel} Account</p>
              </div>
            </div>

            <nav className="mt-6 flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors lg:w-full ${
                    activeTab === item.key
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-2.5 rounded-xl border border-ink-100 px-3.5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
