import { GraduationCap } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import LoginForm from '../../components/auth/LoginForm'

export default function StudentLogin() {
  return (
    <AuthLayout
      icon={GraduationCap}
      gradient="from-brand-600 via-brand-700 to-violet-800"
      title="Learn without limits"
      subtitle="Access your courses, notes and quizzes anytime, anywhere — and track your progress as you grow."
      highlights={[
        'Browse and purchase expert-led courses',
        'Track your learning progress in real time',
        'Access notes and quizzes for every course',
      ]}
    >
      <LoginForm role="student" />
    </AuthLayout>
  )
}
