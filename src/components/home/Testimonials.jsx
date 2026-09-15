import { Quote, Star } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import Section, { SectionHeading } from '../ui/Section'

const avatarTone = {
  brand: 'bg-brand-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  sky: 'bg-sky-600',
  rose: 'bg-rose-600',
}

export default function Testimonials() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Testimonials"
        title="Loved by students, teachers and institutions"
        description="Real stories from people who learn, teach and grow with Skillora every day."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <Quote className="h-7 w-7 text-brand-200" fill="currentColor" />
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">&ldquo;{t.quote}&rdquo;</p>

            <div className="mt-5 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-amber-500 text-amber-500' : 'text-ink-200'}`}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-4">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarTone[t.color] || avatarTone.brand}`}
              >
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">{t.name}</p>
                <p className="text-xs text-ink-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
