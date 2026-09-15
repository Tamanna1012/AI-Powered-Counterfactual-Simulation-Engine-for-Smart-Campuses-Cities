import { useState } from 'react'
import {
  Bell,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Mail,
  School,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'
import DashboardShell from '../../components/dashboard/DashboardShell'
import { PanelCard, StatTile } from '../../components/dashboard/DashboardCard'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'
import { courses } from '../../data/courses'
import { studentsForCourse } from '../../data/mockPeople'
import { getIcon } from '../../lib/icons'

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'services', label: 'Associated Courses', icon: Building2 },
  { key: 'users', label: 'Students & Users', icon: Users },
  { key: 'reports', label: 'Reports', icon: TrendingUp },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'profile', label: 'Profile', icon: User },
]

const associateNotifications = [
  { id: 1, text: '12 new students onboarded from Greenfield College this week', time: '3h ago' },
  { id: 2, text: 'Monthly engagement report is ready for review', time: '1d ago' },
  { id: 3, text: 'Bulk enrollment request received from Sunrise School', time: '2d ago' },
]

export default function AssociateDashboard() {
  const [tab, setTab] = useState('overview')
  const { user } = useAuth()

  const associatedCourses = courses.slice(1, 5)
  const allStudents = associatedCourses.flatMap((c) => studentsForCourse(c.id, 4))
  const avgEngagement = Math.round(
    allStudents.reduce((sum, s) => sum + s.progress, 0) / allStudents.length,
  )

  return (
    <DashboardShell roleLabel="Associate" navItems={navItems} activeTab={tab} onTabChange={setTab}>
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-linear-to-br from-amber-600 via-orange-700 to-ink-900 p-6 text-white shadow-lift sm:p-8">
            <p className="text-sm font-medium text-white/70">Welcome back,</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{user?.name} 👋</h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              You&apos;re supporting {associatedCourses.length} course tracks and{' '}
              {allStudents.length}+ learners across partner institutions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile label="Associated Courses" value={associatedCourses.length} icon={Building2} tone="amber" />
            <StatTile label="Students Tracked" value={allStudents.length} icon={Users} tone="brand" />
            <StatTile label="Avg. Engagement" value={`${avgEngagement}%`} icon={TrendingUp} tone="emerald" />
            <StatTile label="Notifications" value={associateNotifications.length} icon={Bell} tone="rose" />
          </div>

          <PanelCard title="Associated Courses & Services">
            <div className="space-y-3">
              {associatedCourses.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </div>
          </PanelCard>
        </div>
      )}

      {tab === 'services' && (
        <PanelCard title="Associated Courses & Services">
          <div className="space-y-3">
            {associatedCourses.map((course) => (
              <CourseRow key={course.id} course={course} />
            ))}
          </div>
        </PanelCard>
      )}

      {tab === 'users' && (
        <div className="space-y-6">
          {associatedCourses.map((course) => (
            <PanelCard key={course.id} title={course.title}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {studentsForCourse(course.id, 4).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-white">
                      {s.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                      <p className="text-xs text-ink-500">{s.progress}% engaged</p>
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <PanelCard title="Engagement Reports">
          <div className="space-y-4">
            {associatedCourses.map((course) => {
              const students = studentsForCourse(course.id, 4)
              const avg = Math.round(students.reduce((s, x) => s + x.progress, 0) / students.length)
              return (
                <div key={course.id} className="rounded-xl border border-ink-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink-900">{course.title}</p>
                    <span className="text-sm font-semibold text-emerald-600">{avg}% avg. engagement</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-amber-500 to-orange-600"
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </PanelCard>
      )}

      {tab === 'notifications' && (
        <PanelCard title="Notifications">
          <div className="space-y-3">
            {associateNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Bell className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm text-ink-800">{n.text}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      )}

      {tab === 'profile' && (
        <PanelCard title="Profile">
          <div className="flex items-center gap-4 border-b border-ink-100 pb-6">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-xl font-semibold text-white">
              {user?.initials}
            </span>
            <div>
              <p className="font-display text-lg font-bold text-ink-900">{user?.name}</p>
              <p className="flex items-center gap-1.5 text-sm text-ink-500">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </p>
              <Badge tone="amber" icon={School} className="mt-2">
                Associate Account
              </Badge>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Partner Focus</p>
              <p className="mt-1 font-semibold text-ink-900">Schools & Colleges Onboarding</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Courses Supported</p>
              <p className="mt-1 font-semibold text-ink-900">{associatedCourses.length} tracks</p>
            </div>
          </div>
        </PanelCard>
      )}
    </DashboardShell>
  )
}

function CourseRow({ course }) {
  const Icon = getIcon(course.icon)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink-900">{course.title}</p>
        <p className="text-xs text-ink-500">
          {course.category} &middot; {course.studentsCount.toLocaleString('en-IN')} students
        </p>
      </div>
      <ClipboardList className="h-4 w-4 shrink-0 text-ink-300" />
    </div>
  )
}
