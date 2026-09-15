import { Users2 } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import LoginForm from '../../components/auth/LoginForm'

export default function TeacherLogin() {
  return (
    <AuthLayout
      icon={Users2}
      gradient="from-emerald-600 via-teal-700 to-ink-900"
      title="Teach. Inspire. Grow."
      subtitle="Create courses, manage content and track your students' progress — all from one dashboard."
      highlights={[
        'Upload and manage course videos & notes',
        'Create quizzes and track student performance',
        'Get notified about student activity',
      ]}
    >
      <LoginForm role="teacher" />
    </AuthLayout>
  )
}
