import { useMemo, useState } from 'react'
import { ListFilter, Search, SearchX } from 'lucide-react'
import Section from '../components/ui/Section'
import CourseCard from '../components/course/CourseCard'
import Button from '../components/ui/Button'
import { categories, courses } from '../data/courses'

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const sorts = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
]

export default function Courses() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All Levels')
  const [sort, setSort] = useState('popular')

  const filtered = useMemo(() => {
    let list = courses.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.shortDescription.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || c.category === category
      const matchesLevel = level === 'All Levels' || c.level === level
      return matchesQuery && matchesCategory && matchesLevel
    })

    list = [...list].sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      return b.studentsCount - a.studentsCount
    })

    return list
  }, [query, category, level, sort])

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white pb-10 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            Explore Courses
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance sm:text-5xl">
            Find the right course for your goals
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Browse expert-led courses across college education, school academics, competitive
            exams and professional skill development.
          </p>
        </div>

        <div className="relative mx-auto mt-8 max-w-2xl px-5 sm:px-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, e.g. Python, JEE Physics, Web Development..."
              className="w-full rounded-full border border-ink-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-soft outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>
      </section>

      <Section className="pt-8">
        <div className="flex flex-col gap-4 border-b border-ink-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 outline-none focus:border-brand-500"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2">
              <ListFilter className="h-4 w-4 text-ink-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm font-medium text-ink-700 outline-none"
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm font-medium text-ink-500">
          Showing {filtered.length} of {courses.length} courses
        </p>

        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
              <SearchX className="h-8 w-8" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-ink-900">No courses found</h3>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setQuery('')
                setCategory('All')
                setLevel('All Levels')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Section>
    </>
  )
}
