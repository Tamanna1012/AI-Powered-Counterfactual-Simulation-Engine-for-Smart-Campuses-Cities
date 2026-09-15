import { Award, Headphones, LineChart, ShieldCheck, Sparkles, Timer } from 'lucide-react'
import Section, { SectionHeading } from '../ui/Section'

const points = [
  {
    icon: Sparkles,
    title: 'Expert-Led Courses',
    desc: 'Learn from industry professionals and experienced educators who know what actually matters.',
    tone: 'bg-brand-50 text-brand-600',
  },
  {
    icon: Timer,
    title: 'Learn at Your Own Pace',
    desc: 'Lifetime access to course content — pause, rewind and revisit whenever you need to.',
    tone: 'bg-amber-50 text-amber-600',
  },
  {
    icon: LineChart,
    title: 'Track Real Progress',
    desc: 'Visual dashboards show exactly how far you\'ve come and what to focus on next.',
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Award,
    title: 'Certified Completion',
    desc: 'Earn certificates that strengthen your resume and validate your new skills.',
    tone: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Headphones,
    title: 'Doubt-Solving Support',
    desc: 'Get your questions answered by mentors and a community of fellow learners.',
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Trusted',
    desc: 'Safe payments, verified content and a platform trusted by 240+ institutions.',
    tone: 'bg-violet-50 text-violet-600',
  },
]

export default function WhyChooseUs() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why Skillora"
        title="Everything you need to learn with confidence"
        description="A platform designed to make learning effective, measurable and genuinely enjoyable."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p) => (
          <div
            key={p.title}
            className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${p.tone}`}>
              <p.icon className="h-5.5 w-5.5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
