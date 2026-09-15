import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import { serviceCategories } from '../data/services'
import { getIcon } from '../lib/icons'

const tone = {
  brand: {
    chip: 'bg-brand-50 text-brand-700 ring-brand-200',
    icon: 'bg-brand-100 text-brand-700',
    gradient: 'from-brand-500 to-brand-700',
    active: 'bg-brand-600 text-white',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    icon: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-500 to-teal-700',
    active: 'bg-emerald-600 text-white',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-700 ring-amber-200',
    icon: 'bg-amber-100 text-amber-700',
    gradient: 'from-amber-500 to-orange-700',
    active: 'bg-amber-500 text-white',
  },
  sky: {
    chip: 'bg-sky-50 text-sky-700 ring-sky-200',
    icon: 'bg-sky-100 text-sky-700',
    gradient: 'from-sky-500 to-blue-700',
    active: 'bg-sky-600 text-white',
  },
}

export default function Services() {
  const [active, setActive] = useState(serviceCategories[0].id)

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white pb-10 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            Our Services
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance sm:text-5xl">
            Services built for every kind of learner
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            From college placements to school academics and national competitions — explore what
            Skillora offers across every learning stage.
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-y border-ink-100 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 scrollbar-none sm:px-8">
          {serviceCategories.map((cat) => {
            const Icon = getIcon(cat.icon)
            const isActive = active === cat.id
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                onClick={() => setActive(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? tone[cat.color].active : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                <Icon className="h-4 w-4" /> {cat.title}
              </a>
            )
          })}
        </div>
      </div>

      {serviceCategories.map((cat, idx) => {
        const Icon = getIcon(cat.icon)
        const t = tone[cat.color]
        return (
          <Section key={cat.id} id={cat.id} className={idx % 2 === 1 ? 'bg-ink-50/50' : ''}>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="lg:sticky lg:top-36">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-inset ${t.chip}`}
                >
                  Service Category
                </span>
                <div
                  className={`mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${t.gradient} text-white shadow-lift`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="mt-5 font-display text-3xl font-bold text-ink-900 text-balance">
                  {cat.title}
                </h2>
                <p className="mt-3 max-w-md text-ink-500">{cat.description}</p>
                <Button to="/courses" variant="outline" className="mt-6" icon={ArrowRight}>
                  Explore Related Courses
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {cat.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${t.icon}`}>
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="mt-3 font-display text-base font-bold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )
      })}
    </>
  )
}
