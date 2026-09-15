import Hero from '../components/home/Hero'
import AnnouncementStrip from '../components/home/AnnouncementStrip'
import FeaturedCourses from '../components/home/FeaturedCourses'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TrustStats from '../components/home/TrustStats'
import Testimonials from '../components/home/Testimonials'
import CTASection from '../components/home/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <AnnouncementStrip />
      <FeaturedCourses />
      <WhyChooseUs />
      <TrustStats />
      <Testimonials />
      <CTASection />
    </>
  )
}
