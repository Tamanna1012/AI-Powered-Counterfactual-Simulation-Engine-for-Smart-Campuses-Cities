import { useState } from 'react'
import {
  Award,
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  Mail,
  Receipt,
  Sparkles,
  Target,
  User,
} from 'lucide-react'
import DashboardShell from '../../components/dashboard/DashboardShell'
import { PanelCard, StatTile } from '../../components/dashboard/DashboardCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import CourseCard from '../../components/course/CourseCard'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { courses, getCourseById } from '../../data/courses'
import { notesData } from '../../data/notes'
import { getIcon } from '../../lib/icons'
import { progressForCourse } from '../../lib/progress'

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'courses', label: 'My Courses', icon: BookOpen },
  { key: 'notes', label: 'Notes', icon: FileText },
  { key: 'quiz', label: 'Quiz', icon: ClipboardList },
  { key: 'purchases', label: 'Purchase History', icon: Receipt },
  { key: 'profile', label: 'Profile', icon: User },
]

export default function StudentDashboard() {
  const [tab, setTab] = useState('overview')
  const { user } = useAuth()
  const { purchasedCourseIds, purchaseHistory, quizResults } = useData()

  const myCourses = purchasedCourseIds.map(getCourseById).filter(Boolean)
  const recommended = courses.filter((c) => !purchasedCourseIds.includes(c.id)).slice(0, 3)
  const avgProgress = myCourses.length
    ? Math.round(myCourses.reduce((sum, c) => sum + progressForCourse(c.id), 0) / myCourses.length)
    : 0
  const quizzesTaken = Object.keys(quizResults).length

  return (
    <DashboardShell roleLabel="Student" navItems={navItems} activeTab={tab} onTabChange={setTab}>
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-linear-to-br from-brand-600 to-violet-700 p-6 text-white shadow-lift sm:p-8">
            <p className="text-sm font-medium text-white/70">Welcome back,</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{user?.name} 👋</h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              You&apos;re enrolled in {myCourses.length} course{myCourses.length === 1 ? '' : 's'}.
              Keep going — consistency is what gets you results.
            </p>
            <Button to="/courses" variant="white" size="sm" className="mt-5">
              Explore More Courses
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile label="Enrolled Courses" value={myCourses.length} icon={BookOpen} tone="brand" />
            <StatTile label="Avg. Progress" value={`${avgProgress}%`} icon={Target} tone="emerald" />
            <StatTile label="Quizzes Taken" value={quizzesTaken} icon={ClipboardList} tone="amber" />
            <StatTile label="Purchases" value={purchaseHistory.length} icon={Receipt} tone="sky" />
          </div>

          <PanelCard
            title="Continue Learning"
            action={
              myCourses.length > 0 && (
                <button onClick={() => setTab('courses')} className="text-sm font-semibold text-brand-600 hover:underline">
                  View All
                </button>
              )
            }
          >
            {myCourses.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No courses yet"
                desc="Explore our catalog and enroll in your first course to get started."
                action={<Button to="/courses">Explore Courses</Button>}
              />
            ) : (
              <div className="space-y-3">
                {myCourses.slice(0, 3).map((course) => (
                  <CourseProgressRow key={course.id} course={course} />
                ))}
              </div>
            )}
          </PanelCard>

          {recommended.length > 0 && (
            <PanelCard title="Recommended For You">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </PanelCard>
          )}
        </div>
      )}

      {tab === 'courses' && (
        <PanelCard title="My Courses">
          {myCourses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No purchased courses yet"
              desc="Once you buy a course, it will show up here with your progress."
              action={<Button to="/courses">Browse Courses</Button>}
            />
          ) : (
            <div className="space-y-4">
              {myCourses.map((course) => (
                <CourseProgressRow key={course.id} course={course} expanded />
              ))}
            </div>
          )}
        </PanelCard>
      )}

      {tab === 'notes' && (
        <PanelCard title="Course Notes">
          {myCourses.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No notes available yet"
              desc="Purchase a course to unlock chapter-wise downloadable notes."
              action={<Button to="/courses">Browse Courses</Button>}
            />
          ) : (
            <div className="space-y-3">
              {myCourses.map((course) => {
                const count = notesData.filter((n) => n.courseId === course.id).length
                return (
                  <div
                    key={course.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 p-4"
                  >
                    <div>
                      <p className="font-semibold text-ink-900">{course.title}</p>
                      <p className="text-sm text-ink-500">{count} notes available</p>
                    </div>
                    <Button to={`/notes?course=${course.id}`} variant="outline" size="sm" icon={Download}>
                      View Notes
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </PanelCard>
      )}

      {tab === 'quiz' && (
        <PanelCard title="Quizzes">
          {myCourses.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No quizzes available yet"
              desc="Purchase a course to unlock its practice quiz."
              action={<Button to="/courses">Browse Courses</Button>}
            />
          ) : (
            <div className="space-y-3">
              {myCourses
                .filter((c) => c.quizAvailable)
                .map((course) => {
                  const result = quizResults[course.id]
                  return (
                    <div
                      key={course.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 p-4"
                    >
                      <div>
                        <p className="font-semibold text-ink-900">{course.title}</p>
                        {result ? (
                          <p className="text-sm text-emerald-600">
                            Last score: {result.score}/{result.total}
                          </p>
                        ) : (
                          <p className="text-sm text-ink-500">Not attempted yet</p>
                        )}
                      </div>
                      <Button to={`/quiz/${course.id}`} variant={result ? 'outline' : 'primary'} size="sm">
                        {result ? 'Retake Quiz' : 'Start Quiz'}
                      </Button>
                    </div>
                  )
                })}
            </div>
          )}
        </PanelCard>
      )}

      {tab === 'purchases' && (
        <PanelCard title="Purchase History">
          {purchaseHistory.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No purchases yet"
              desc="Your course purchases and payment receipts will appear here."
              action={<Button to="/courses">Browse Courses</Button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Transaction ID</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {purchaseHistory.map((txn) => (
                    <tr key={txn.id}>
                      <td className="py-3.5 font-medium text-ink-800">{txn.courseTitle}</td>
                      <td className="py-3.5 text-ink-500">{txn.id}</td>
                      <td className="py-3.5 text-ink-500">
                        {new Date(txn.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 font-medium text-ink-800">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5">
                        <Badge tone="emerald">{txn.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>
      )}

      {tab === 'profile' && <ProfilePanel />}
    </DashboardShell>
  )
}

function CourseProgressRow({ course, expanded = false }) {
  const progress = progressForCourse(course.id)
  const Icon = getIcon(course.icon)
  return (
    <div className="rounded-xl border border-ink-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-ink-900">{course.title}</p>
            <p className="text-xs text-ink-500">{course.category}</p>
          </div>
        </div>
        <Button to={`/courses/${course.slug}`} variant="outline" size="sm">
          Continue
        </Button>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-linear-to-r from-brand-500 to-violet-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {expanded && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
          <Button to={`/notes?course=${course.id}`} variant="ghost" size="sm" icon={FileText} iconPosition="left">
            Notes
          </Button>
          <Button to={`/quiz/${course.id}`} variant="ghost" size="sm" icon={ClipboardList} iconPosition="left">
            Quiz
          </Button>
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

function ProfilePanel() {
  const { user, login } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    login('student', { name, email: user.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PanelCard title="Profile">
      <div className="flex items-center gap-4 border-b border-ink-100 pb-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white">
          {user?.initials}
        </span>
        <div>
          <p className="font-display text-lg font-bold text-ink-900">{user?.name}</p>
          <p className="flex items-center gap-1.5 text-sm text-ink-500">
            <Mail className="h-3.5 w-3.5" /> {user?.email}
          </p>
          <Badge tone="brand" icon={Sparkles} className="mt-2">
            Student Account
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSave} className="mt-6 max-w-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Email Address</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-400 outline-none"
          />
        </div>
        <Button type="submit" icon={Award}>
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </form>
    </PanelCard>
  )
}
