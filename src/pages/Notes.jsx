import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, FileText, Lock, Search, SearchX } from 'lucide-react'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { courses } from '../data/courses'
import { notesData } from '../data/notes'
import { getIcon } from '../lib/icons'
import { useData } from '../context/DataContext'
import { useBuyNow } from '../hooks/useBuyNow'

export default function Notes() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState(params.get('course') || 'all')
  const { isPurchased } = useData()
  const buyNow = useBuyNow()

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => c.notesAvailable)
      .filter((c) => courseFilter === 'all' || c.id === courseFilter)
      .map((c) => ({
        course: c,
        notes: notesData.filter(
          (n) =>
            n.courseId === c.id &&
            (!query || n.chapter.toLowerCase().includes(query.toLowerCase())),
        ),
      }))
      .filter((group) => group.notes.length > 0 || (!query && courseFilter !== 'all'))
  }, [query, courseFilter])

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white pb-10 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            <FileText className="h-4 w-4" /> Course Notes
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance sm:text-5xl">
            Exam-ready notes for every course
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Find chapter-wise, downloadable notes for courses you&apos;ve purchased — search by
            topic or browse by course.
          </p>
        </div>
      </section>

      <Section className="pt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes by chapter or topic..."
              className="w-full rounded-full border border-ink-200 bg-white py-3 pl-12 pr-4 text-sm shadow-soft outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-full border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-700 shadow-soft outline-none focus:border-brand-500 sm:w-64"
          >
            <option value="all">All Courses</option>
            {courses
              .filter((c) => c.notesAvailable)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
          </select>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
              <SearchX className="h-8 w-8" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-ink-900">No notes found</h3>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              Try a different search term or select another course.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {filteredCourses.map(({ course, notes }) => {
              const Icon = getIcon(course.icon)
              const owned = isPurchased(course.id)
              return (
                <div key={course.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display text-base font-bold text-ink-900">{course.title}</p>
                        <p className="text-xs text-ink-500">{notes.length} notes available</p>
                      </div>
                    </div>
                    {owned ? (
                      <Badge tone="emerald">Unlocked</Badge>
                    ) : (
                      <Button size="sm" variant="accent" onClick={() => buyNow(course)}>
                        Buy to Unlock
                      </Button>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink-800">{note.chapter}</p>
                          <p className="text-xs text-ink-400">
                            {note.type} &middot; {note.size} &middot; {note.pages} pages
                          </p>
                        </div>
                        {owned ? (
                          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100">
                            <Download className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-400">
                            <Lock className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Section>
    </>
  )
}
