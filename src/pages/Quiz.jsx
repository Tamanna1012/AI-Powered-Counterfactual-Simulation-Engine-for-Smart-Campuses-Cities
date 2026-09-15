import { ClipboardList, Lock, Trophy } from 'lucide-react'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { courses } from '../data/courses'
import { quizzes } from '../data/quizzes'
import { getIcon } from '../lib/icons'
import { courseGradients } from '../lib/theme'
import { useData } from '../context/DataContext'
import { useBuyNow } from '../hooks/useBuyNow'

export default function Quiz() {
  const { isPurchased, quizResults } = useData()
  const buyNow = useBuyNow()

  const quizCourses = courses.filter((c) => c.quizAvailable)

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white pb-10 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            <ClipboardList className="h-4 w-4" /> Quizzes
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance sm:text-5xl">
            Test your knowledge, track your growth
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Pick a course, answer a set of MCQs and get your score instantly.
          </p>
        </div>
      </section>

      <Section className="pt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizCourses.map((course) => {
            const Icon = getIcon(course.icon)
            const quiz = quizzes.find((q) => q.courseId === course.id)
            const owned = isPurchased(course.id)
            const result = quizResults[course.id]

            return (
              <div key={course.id} className="flex flex-col rounded-2xl border border-ink-100 bg-white shadow-soft">
                <div
                  className={`flex h-32 items-center justify-center bg-linear-to-br ${courseGradients[course.color] || courseGradients.brand}`}
                >
                  <Icon className="h-12 w-12 text-white/90" strokeWidth={1.5} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-bold text-ink-900">{quiz?.title}</h3>
                  <p className="mt-1 text-sm text-ink-500">{course.title}</p>
                  <p className="mt-2 text-xs font-medium text-ink-400">
                    {quiz?.questions.length} questions &middot; ~{quiz?.questions.length * 1} min
                  </p>

                  {result && (
                    <Badge tone="emerald" icon={Trophy} className="mt-3 w-fit">
                      Last score: {result.score}/{result.total}
                    </Badge>
                  )}

                  <div className="mt-4">
                    {owned ? (
                      <Button to={`/quiz/${course.id}`} className="w-full">
                        {result ? 'Retake Quiz' : 'Start Quiz'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        icon={Lock}
                        iconPosition="left"
                        className="w-full"
                        onClick={() => buyNow(course)}
                      >
                        Unlock with Course
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </>
  )
}
