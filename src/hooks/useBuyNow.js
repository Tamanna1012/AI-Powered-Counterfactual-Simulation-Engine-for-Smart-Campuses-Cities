import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function useBuyNow() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return function buyNow(course) {
    const target = `/payment/${course.id}`
    if (!user || user.role !== 'student') {
      navigate(`/login/student?redirect=${encodeURIComponent(target)}`)
      return
    }
    navigate(target)
  }
}
