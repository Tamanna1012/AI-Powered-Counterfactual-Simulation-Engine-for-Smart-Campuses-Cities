import { useState } from 'react'
import {
  Bell,
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Mail,
  Plus,
  Star,
  Upload,
  User,
  Users,
} from 'lucide-react'
import DashboardShell from '../../components/dashboard/DashboardShell'
import { PanelCard, StatTile } from '../../components/dashboard/DashboardCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../context/AuthContext'
import { courses } from '../../data/courses'
import { notesData } from '../../data/notes'
import { quizzes } from '../../data/quizzes'
import { studentsForCourse } from '../../data/mockPeople'
import { getIcon } from '../../lib/icons'

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'courses', label: 'My Courses', icon: BookOpen },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'quiz', label: 'Quiz Management', icon: ClipboardList },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'profile', label: 'Profile', icon: User },
]

const teacherNotifications = [
  { id: 1, text: 'Diya Patel enrolled in Data Structures & Algorithms Mastery', time: '2h ago' },
  { id: 2, text: 'New doubt posted on Full-Stack Web Development Bootcamp', time: '5h ago' },
  { id: 3, text: 'Your course "Python Programming for Beginners" hit 30,000 students!', time: '1d ago' },
  { id: 4, text: 'Weekly performance report is ready to view', time: '2d ago' },
]

export default function TeacherDashboard() {
  const [tab, setTab] = useState('overview')
  const { user } = useAuth()
  const [uploadModal, setUploadModal] = useState(null)

  const myCourses = courses.slice(0, 3)
  const totalStudents = myCourses.reduce((sum, c) => sum + c.studentsCount, 0)
  const avgRating = (myCourses.reduce((sum, c) => sum + c.rating, 0) / myCourses.length).toFixed(1)

  return (
    <DashboardShell roleLabel="Teacher" navItems={navItems} activeTab={tab} onTabChange={setTab}>
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-linear-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-lift sm:p-8">
            <p className="text-sm font-medium text-white/70">Welcome back,</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{user?.name} 👋</h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              You&apos;re teaching {myCourses.length} courses reaching{' '}
              {totalStudents.toLocaleString('en-IN')} students. Keep the momentum going!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile label="My Courses" value={myCourses.length} icon={BookOpen} tone="emerald" />
            <StatTile label="Total Students" value={totalStudents.toLocaleString('en-IN')} icon={Users} tone="brand" />
            <StatTile label="Avg. Rating" value={avgRating} icon={Star} tone="amber" />
            <StatTile label="Notifications" value={teacherNotifications.length} icon={Bell} tone="rose" />
          </div>

          <PanelCard title="Your Courses">
            <div className="space-y-3">
              {myCourses.map((course) => (
                <CourseRow key={course.id} course={course} onUpload={setUploadModal} />
              ))}
            </div>
          </PanelCard>
        </div>
      )}

      {tab === 'courses' && (
        <PanelCard title="Manage Course Content">
          <div className="space-y-3">
            {myCourses.map((course) => (
              <CourseRow key={course.id} course={course} onUpload={setUploadModal} detailed />
            ))}
          </div>
        </PanelCard>
      )}

      {tab === 'students' && (
        <div className="space-y-6">
          {myCourses.map((course) => (
            <PanelCard key={course.id} title={course.title}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {studentsForCourse(course.id).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                      {s.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                      <p className="truncate text-xs text-ink-500">{s.email}</p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          ))}
        </div>
      )}

      {tab === 'quiz' && (
        <PanelCard title="Quiz Management">
          <div className="space-y-3">
            {myCourses.map((course) => {
              const quiz = quizzes.find((q) => q.courseId === course.id)
              return (
                <div
                  key={course.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-ink-900">{course.title}</p>
                    <p className="text-sm text-ink-500">
                      {quiz ? `${quiz.questions.length} questions` : 'No quiz created yet'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Plus}
                    iconPosition="left"
                    onClick={() => setUploadModal({ type: 'question', course })}
                  >
                    Add Question
                  </Button>
                </div>
              )
            })}
          </div>
        </PanelCard>
      )}

      {tab === 'notifications' && (
        <PanelCard title="Notifications">
          <div className="space-y-3">
            {teacherNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
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
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-xl font-semibold text-white">
              {user?.initials}
            </span>
            <div>
              <p className="font-display text-lg font-bold text-ink-900">{user?.name}</p>
              <p className="flex items-center gap-1.5 text-sm text-ink-500">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </p>
              <Badge tone="emerald" className="mt-2">
                Teacher Account
              </Badge>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Courses Teaching</p>
              <p className="mt-1 font-semibold text-ink-900">{myCourses.length} courses</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Total Reach</p>
              <p className="mt-1 font-semibold text-ink-900">
                {totalStudents.toLocaleString('en-IN')} students
              </p>
            </div>
          </div>
        </PanelCard>
      )}

      <Modal
        open={!!uploadModal}
        onClose={() => setUploadModal(null)}
        title={uploadModal?.type === 'question' ? 'Add Quiz Question' : `Upload to ${uploadModal?.course?.title || ''}`}
      >
        <MockUploadForm modal={uploadModal} onClose={() => setUploadModal(null)} />
      </Modal>
    </DashboardShell>
  )
}

function CourseRow({ course, onUpload, detailed = false }) {
  const Icon = getIcon(course.icon)
  const noteCount = notesData.filter((n) => n.courseId === course.id).length

  return (
    <div className="rounded-xl border border-ink-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-ink-900">{course.title}</p>
            <p className="text-xs text-ink-500">
              {course.videos.length} videos &middot; {noteCount} notes &middot;{' '}
              {course.studentsCount.toLocaleString('en-IN')} students
            </p>
          </div>
        </div>
        {detailed && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={Upload}
              iconPosition="left"
              onClick={() => onUpload({ type: 'video', course })}
            >
              Upload Video
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={FileText}
              iconPosition="left"
              onClick={() => onUpload({ type: 'note', course })}
            >
              Upload Notes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function MockUploadForm({ modal, onClose }) {
  const [done, setDone] = useState(false)

  if (!modal) return null

  if (done) {
    return (
      <div className="py-6 text-center">
        <p className="font-semibold text-emerald-600">Uploaded successfully (prototype)!</p>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Close
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
      className="space-y-4"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700">Title</label>
        <input
          required
          type="text"
          placeholder={modal.type === 'question' ? 'Enter question text' : 'Enter title'}
          className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      {modal.type !== 'question' && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">File</label>
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 py-8 text-center text-sm text-ink-400">
            <Upload className="mr-2 h-4 w-4" /> Click or drag file to upload (prototype only)
          </div>
        </div>
      )}
      <Button type="submit" className="w-full">
        {modal.type === 'question' ? 'Add Question' : 'Upload'}
      </Button>
    </form>
  )
}
