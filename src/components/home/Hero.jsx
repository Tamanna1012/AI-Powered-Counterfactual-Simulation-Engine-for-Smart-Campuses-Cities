import { ArrowRight, BookOpenCheck, PlayCircle, Sparkles, Star, TrendingUp, Users } from 'lucide-react'
import Button from '../ui/Button'
import StatCounter from '../ui/StatCounter'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
      <div className="absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-brand-300/30 blur-3xl" />
      <div className="absolute top-40 left-[-10%] h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            <Sparkles className="h-4 w-4" />
            Trusted by 120,000+ learners &amp; 240+ institutions
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 text-balance sm:text-5xl lg:text-6xl">
            Learn skills that
            <span className="bg-linear-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent"> get you ahead</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-500">
            Skillora brings expert-led courses, exam-ready notes and interactive quizzes for
            students, teachers, colleges and schools — everything you need to learn, teach and
            grow, in one modern platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/courses" size="lg" icon={ArrowRight}>
              Explore Courses
            </Button>
            <Button to="/login/student" size="lg" variant="outline" icon={PlayCircle} iconPosition="left">
              Get Started Free
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-100 pt-8 sm:max-w-md">
            <div>
              <p className="font-display text-2xl font-bold text-ink-900">
                <StatCounter value={120000} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-medium text-ink-500">Active Learners</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-ink-900">
                <StatCounter value={180} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-medium text-ink-500">Courses</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-ink-900">4.8/5</p>
              <p className="mt-1 text-xs font-medium text-ink-500">Avg. Rating</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-6 rounded-[2.5rem] bg-linear-to-br from-brand-500 via-brand-600 to-violet-700 shadow-2xl">
              <div className="absolute inset-0 rounded-[2.5rem] bg-noise opacity-20" />
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-white">
                <BookOpenCheck className="h-16 w-16" strokeWidth={1.5} />
                <p className="font-display text-lg font-semibold">Your learning journey, reimagined</p>
              </div>
            </div>

            <div className="animate-float absolute -left-6 top-6 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-lift">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">4.8 Rating</p>
                <p className="text-xs text-ink-500">2,000+ reviews</p>
              </div>
            </div>

            <div className="animate-float-slow absolute -right-4 top-1/3 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-lift">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">94% Completion</p>
                <p className="text-xs text-ink-500">Course success rate</p>
              </div>
            </div>

            <div className="animate-float absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-lift">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">120k+ Learners</p>
                <p className="text-xs text-ink-500">Across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
