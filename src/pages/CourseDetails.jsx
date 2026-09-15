import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  BadgeCheck,
  BookText,
  CheckCircle2,
  ClipboardList,
  Clock,
  Infinity as InfinityIcon,
  Lock,
  Play,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
} from 'lucide-react'
import Section from '../components/ui/Section'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { getCourseBySlug } from '../data/courses'
import { getIcon } from '../lib/icons'
import { courseGradients } from '../lib/theme'
import { useBuyNow } from '../hooks/useBuyNow'
import { useData } from '../context/DataContext'

export default function CourseDetails() {
  const { slug } = useParams()
  const course = getCourseBySlug(slug)
  const [previewVideo, setPreviewVideo] = useState(null)
  const buyNow = useBuyNow()
  const { isPurchased } = useData()

  if (!course) return <Navigate to="/courses" replace />

  const owned = isPurchased(course.id)
  const Icon = getIcon(course.icon)
  const discount = Math.round(100 - (course.price / course.originalPrice) * 100)

  return (
    <>
      <section
        className={`relative overflow-hidden bg-linear-to-br ${courseGradients[course.color] || courseGradients.brand} pb-20 pt-14 text-white sm:pt-16`}
      >
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span>Courses</span>
            <span>/</span>
            <span>{course.category}</span>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {course.tag && (
                  <Badge tone="ink" className="bg-white/15 text-white ring-white/25">
                    {course.tag}
                  </Badge>
                )}
                <Badge tone="ink" className="bg-white/15 text-white ring-white/25">
                  {course.level}
                </Badge>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold text-balance sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-4 max-w-xl text-white/85">{course.shortDescription}</p>

              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Star className="h-4 w-4 fill-amber-glow text-amber-glow" />
                  {course.rating}
                  <span className="font-normal text-white/70">
                    ({course.ratingCount.toLocaleString('en-IN')} ratings)
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-white/85">
                  <Users className="h-4 w-4" /> {course.studentsCount.toLocaleString('en-IN')} students
                </span>
                <span className="flex items-center gap-1.5 text-white/85">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                  {course.instructor.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{course.instructor.name}</p>
                  <p className="text-xs text-white/70">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <div className="flex h-48 w-48 items-center justify-center rounded-[2rem] bg-white/10 backdrop-blur-sm">
                <Icon className="h-24 w-24 text-white/90" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="pt-0">
        <div className="-mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-xl font-bold text-ink-900">About This Course</h2>
              <p className="mt-3 leading-relaxed text-ink-500">{course.description}</p>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-xl font-bold text-ink-900">What You&apos;ll Learn</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <div key={o} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                    <span className="text-sm text-ink-600">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-ink-900">Course Content</h2>
                <span className="text-sm text-ink-500">{course.videos.length} videos</span>
              </div>
              <div className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-100">
                {course.videos.map((video, i) => {
                  const unlocked = video.free || owned
                  return (
                    <button
                      key={video.id}
                      onClick={() => unlocked && setPreviewVideo(video)}
                      disabled={!unlocked}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                        unlocked ? 'hover:bg-ink-50' : 'cursor-not-allowed opacity-70'
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink-800">
                          {video.title}
                        </span>
                        <span className="text-xs text-ink-400">{video.duration}</span>
                      </span>
                      {unlocked ? (
                        <PlayCircle className="h-5 w-5 shrink-0 text-brand-600" />
                      ) : (
                        <Lock className="h-4 w-4 shrink-0 text-ink-400" />
                      )}
                      {video.free && !owned && (
                        <Badge tone="emerald" className="ml-1 shrink-0">
                          Free Preview
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <BookText className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink-900">
                  Downloadable Notes
                </h3>
                <p className="mt-1.5 text-sm text-ink-500">
                  {course.notesAvailable
                    ? 'Chapter-wise notes included — available in your dashboard after purchase.'
                    : 'Notes are not available for this course yet.'}
                </p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <ClipboardList className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink-900">
                  Practice Quiz
                </h3>
                <p className="mt-1.5 text-sm text-ink-500">
                  {course.quizAvailable
                    ? 'Test your understanding with a course-specific quiz and instant scoring.'
                    : 'A quiz is not available for this course yet.'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-xl font-bold text-ink-900">Your Instructor</h2>
              <div className="mt-4 flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white">
                  {course.instructor.initials}
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{course.instructor.name}</p>
                  <p className="text-sm text-brand-600">{course.instructor.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift">
              <div
                className={`flex h-40 items-center justify-center bg-linear-to-br ${courseGradients[course.color] || courseGradients.brand}`}
              >
                <Icon className="h-16 w-16 text-white/90" strokeWidth={1.5} />
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <span className="font-display text-3xl font-extrabold text-ink-900">
                    ₹{course.price.toLocaleString('en-IN')}
                  </span>
                  <span className="mb-1 text-base text-ink-400 line-through">
                    ₹{course.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-emerald-600">
                  {discount}% off — limited time offer
                </p>

                <Button
                  variant="accent"
                  size="lg"
                  className="mt-5 w-full"
                  onClick={() => buyNow(course)}
                  disabled={owned}
                >
                  {owned ? 'Already Purchased' : 'Buy Now'}
                </Button>
                {owned && (
                  <Button to="/dashboard/student" variant="outline" className="mt-2.5 w-full">
                    Go to My Courses
                  </Button>
                )}

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout &middot; 7-day refund policy
                </p>

                <div className="mt-6 space-y-3 border-t border-ink-100 pt-5">
                  {course.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2.5 text-sm text-ink-600">
                      <BadgeCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                      {b}
                    </div>
                  ))}
                  <div className="flex items-start gap-2.5 text-sm text-ink-600">
                    <InfinityIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                    Lifetime access, any device
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-ink-600">
                    <Smartphone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                    Learn on mobile, tablet or desktop
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Modal
        open={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        title={previewVideo?.title}
      >
        <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl bg-ink-900 text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Play className="h-6 w-6 fill-white" />
          </span>
          <p className="text-sm text-white/70">Video preview &middot; {previewVideo?.duration}</p>
        </div>
        <p className="mt-4 text-xs text-ink-400">
          This is a prototype preview. In production, the actual lesson video would play here.
        </p>
      </Modal>
    </>
  )
}
