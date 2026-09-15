import { Link } from 'react-router-dom'
import { PlayCircle, Star, Users } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { getIcon } from '../../lib/icons'
import { courseGradients, tagTone } from '../../lib/theme'
import { useBuyNow } from '../../hooks/useBuyNow'
import { useData } from '../../context/DataContext'

export default function CourseCard({ course }) {
  const Icon = getIcon(course.icon)
  const buyNow = useBuyNow()
  const { isPurchased } = useData()
  const owned = isPurchased(course.id)
  const discount = Math.round(100 - (course.price / course.originalPrice) * 100)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to={`/courses/${course.slug}`}
        className={`relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br ${courseGradients[course.color] || courseGradients.brand}`}
      >
        <div className="absolute inset-0 bg-noise opacity-30" />
        <Icon className="h-16 w-16 text-white/90 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        {course.tag && (
          <span className="absolute left-3 top-3">
            <Badge tone={tagTone[course.tag] || 'brand'} className="bg-white/95 shadow-soft ring-0">
              {course.tag}
            </Badge>
          </span>
        )}
        {owned && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
            Owned
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-500">
          <span>{course.category}</span>
          <span className="h-1 w-1 rounded-full bg-ink-300" />
          <span>{course.level}</span>
        </div>

        <Link to={`/courses/${course.slug}`}>
          <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold text-ink-900 transition-colors group-hover:text-brand-700">
            {course.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{course.shortDescription}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1 font-medium text-amber-600">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {course.studentsCount.toLocaleString('en-IN')}
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle className="h-3.5 w-3.5" /> {course.videos.length} videos
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="font-display text-xl font-extrabold text-ink-900">
              ₹{course.price.toLocaleString('en-IN')}
            </span>
            <span className="ml-2 text-sm text-ink-400 line-through">
              ₹{course.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="ml-1 text-xs font-semibold text-emerald-600">{discount}% off</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button to={`/courses/${course.slug}`} variant="outline" size="sm" className="flex-1">
            View Course
          </Button>
          <Button
            variant="accent"
            size="sm"
            className="flex-1"
            onClick={() => buyNow(course)}
            disabled={owned}
          >
            {owned ? 'Owned' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}
