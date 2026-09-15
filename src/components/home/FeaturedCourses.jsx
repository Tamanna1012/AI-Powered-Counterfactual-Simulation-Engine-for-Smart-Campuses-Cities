import { ArrowRight } from 'lucide-react'
import { courses } from '../../data/courses'
import Section, { SectionHeading } from '../ui/Section'
import Button from '../ui/Button'
import CourseCard from '../course/CourseCard'

export default function FeaturedCourses() {
  return (
    <Section className="bg-ink-50/50">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          align="left"
          eyebrow="Featured Courses"
          title="Popular courses to kickstart your learning"
          description="Hand-picked courses across school, college and competitive exam categories — built by industry experts and top educators."
          className="sm:mx-0 sm:max-w-xl"
        />
        <Button to="/courses" variant="outline" icon={ArrowRight} className="hidden sm:inline-flex">
          View All Courses
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 6).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Button to="/courses" variant="outline" icon={ArrowRight}>
          View All Courses
        </Button>
      </div>
    </Section>
  )
}
