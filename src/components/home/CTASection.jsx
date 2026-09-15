import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'

export default function CTASection() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-brand-700 to-violet-800 px-6 py-14 text-center shadow-lift sm:px-14 sm:py-16">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-glow/20 blur-3xl" />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white text-balance sm:text-4xl">
            Ready to start learning with Skillora?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Join thousands of students, teachers and institutions already growing with our
            courses, notes and quizzes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/courses" variant="white" size="lg" icon={ArrowRight}>
              Explore Courses
            </Button>
            <Button to="/login/student" variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
