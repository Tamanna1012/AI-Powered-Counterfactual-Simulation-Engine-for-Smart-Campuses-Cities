export const roles = [
  {
    id: 'student',
    label: 'Student',
    description: 'Browse courses, learn and track your progress',
    loginPath: '/login/student',
    dashboardPath: '/dashboard/student',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    description: 'Create and manage courses for your students',
    loginPath: '/login/teacher',
    dashboardPath: '/dashboard/teacher',
  },
  {
    id: 'associate',
    label: 'Associate',
    description: 'Support institutions and track engagement',
    loginPath: '/login/associate',
    dashboardPath: '/dashboard/associate',
  },
]

export function getRole(id) {
  return roles.find((r) => r.id === id) || roles[0]
}
