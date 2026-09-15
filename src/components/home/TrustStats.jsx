import { trustStats, achievements } from '../../data/stats'
import { getIcon } from '../../lib/icons'
import StatCounter from '../ui/StatCounter'
import { SectionHeading } from '../ui/Section'

export default function TrustStats() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Our Impact"
          title="Numbers that reflect real learning outcomes"
          description="Recognized by institutions and learners for delivering consistent, measurable results."
          tone="dark"
        />

        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {trustStats.map((stat) => {
            const Icon = getIcon(stat.icon)
            return (
              <div
                key={stat.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <p className="mt-4 font-display text-3xl font-extrabold">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-sm text-ink-300">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a) => {
            const Icon = getIcon(a.icon)
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-glow/20 text-amber-glow">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{a.org}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
