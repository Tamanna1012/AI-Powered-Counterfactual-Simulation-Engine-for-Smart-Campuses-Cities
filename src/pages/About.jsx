import { Eye, Gauge, HeartHandshake, ShieldCheck, Sparkles, Target, Users } from 'lucide-react'
import Section, { SectionHeading } from '../components/ui/Section'
import StatCounter from '../components/ui/StatCounter'
import CTASection from '../components/home/CTASection'
import { achievements, trustStats } from '../data/stats'
import { getIcon } from '../lib/icons'

const differentiators = [
  {
    icon: Target,
    title: 'Learner-First Design',
    desc: 'Every course, note and quiz is built around how students actually learn and retain information.',
  },
  {
    icon: Gauge,
    title: 'Quality Over Quantity',
    desc: 'We work with a curated set of expert educators instead of flooding the catalog with filler content.',
  },
  {
    icon: Users,
    title: 'Built With Institutions',
    desc: 'Schools and colleges shape our roadmap, so content stays relevant to real classroom needs.',
  },
  {
    icon: HeartHandshake,
    title: 'Support That Shows Up',
    desc: 'Doubt-solving, mentorship and dedicated support for students, teachers and associates alike.',
  },
]

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white pb-16 pt-16 sm:pb-20 sm:pt-20">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            <Sparkles className="h-4 w-4" /> About Skillora
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance sm:text-5xl">
            Building the future of learning, together
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Skillora is a modern learning platform connecting students, teachers, colleges and
            schools with expert-led courses, exam-ready notes and interactive quizzes — designed
            to make quality education accessible, measurable and genuinely engaging.
          </p>
        </div>
      </section>

      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Our Story
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 text-balance">
              Started to close the gap between learning and real outcomes
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              Skillora began with a simple observation: great content exists everywhere, but
              structured, outcome-focused learning is rare. We set out to build a platform where
              students don&apos;t just watch videos — they build real skills, track measurable
              progress and get support when they&apos;re stuck.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              Today, Skillora partners with schools, colleges and independent educators to deliver
              courses, notes and quizzes that are structured for genuine understanding — not just
              completion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {trustStats.map((stat) => {
              const Icon = getIcon(stat.icon)
              return (
                <div
                  key={stat.id}
                  className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-soft"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-display text-2xl font-bold text-ink-900">
                    <StatCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-500">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      <Section className="bg-ink-50/50">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-linear-to-br from-brand-600 to-brand-800 p-8 text-white shadow-lift">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Target className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold">Our Mission</h3>
            <p className="mt-3 leading-relaxed text-white/85">
              To make high-quality, outcome-driven education accessible to every student, teacher,
              school and college — regardless of location or background.
            </p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-violet-600 to-ink-900 p-8 text-white shadow-lift">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Eye className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold">Our Vision</h3>
            <p className="mt-3 leading-relaxed text-white/85">
              A world where every learner has a clear, supported path from curiosity to
              capability — and every educator has the tools to make that happen.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="What Makes Us Different"
          title="Designed for outcomes, not just content"
          description="A few principles that guide everything we build."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <d.icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink-900">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{d.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-950 text-white">
        <SectionHeading
          eyebrow="Recognition"
          title="Awards, achievements & why customers trust us"
          description="Independent recognition and outcomes that back up what we promise."
          tone="dark"
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a) => {
            const Icon = getIcon(a.icon)
            return (
              <div
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-glow/15 text-amber-glow">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm font-bold text-white">{a.title}</p>
                <p className="mt-1 text-xs text-ink-400">{a.org}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center text-sm text-ink-300">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          Verified educators, secure payments and a transparent refund policy — trusted by 240+
          institutions across the country.
        </div>
      </Section>

      <CTASection />
    </>
  )
}
