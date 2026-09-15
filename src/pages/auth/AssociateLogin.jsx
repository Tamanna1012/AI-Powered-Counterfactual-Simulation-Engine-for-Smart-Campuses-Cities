import { UserCog } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import LoginForm from '../../components/auth/LoginForm'

export default function AssociateLogin() {
  return (
    <AuthLayout
      icon={UserCog}
      gradient="from-amber-600 via-orange-700 to-ink-900"
      title="Support learners at scale"
      subtitle="Manage institutional relationships, track engagement and support students and teachers on the platform."
      highlights={[
        'Manage associated courses & institutions',
        'Track student and teacher engagement',
        'Access reports and basic statistics',
      ]}
    >
      <LoginForm role="associate" />
    </AuthLayout>
  )
}
