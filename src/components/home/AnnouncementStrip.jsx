import { Bell, Calendar, Info, Newspaper, Percent } from 'lucide-react'
import { announcements } from '../../data/announcements'
import Section from '../ui/Section'

const typeMeta = {
  offer: { icon: Percent, tone: 'text-amber-600 bg-amber-50', label: 'Offer' },
  event: { icon: Calendar, tone: 'text-brand-600 bg-brand-50', label: 'Event' },
  news: { icon: Newspaper, tone: 'text-emerald-600 bg-emerald-50', label: 'News' },
  info: { icon: Info, tone: 'text-sky-600 bg-sky-50', label: 'Info' },
}

export default function AnnouncementStrip() {
  return (
    <Section className="py-10">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
          <Bell className="h-4 w-4" />
        </span>
        <h2 className="font-display text-lg font-bold text-ink-900">Latest Updates &amp; Offers</h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {announcements.map((item) => {
          const meta = typeMeta[item.type] || typeMeta.info
          const Icon = meta.icon
          return (
            <div
              key={item.id}
              className="flex flex-col rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${meta.tone}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                {meta.label}
              </p>
              <p className="mt-1 text-sm font-bold text-ink-900">{item.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{item.description}</p>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
