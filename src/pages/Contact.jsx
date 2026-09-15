import { useState } from 'react'
import { CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from '../components/icons/SocialIcons'

const socials = [
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: YoutubeIcon, href: '#', label: 'YouTube' },
]

const initialForm = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email and message.')
      return
    }
    setError('')
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white pb-10 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            <MessageSquare className="h-4 w-4" /> Contact Us
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 text-balance sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Questions about courses, bulk enrollment for schools and colleges, or anything else —
            our team typically responds within a business day.
          </p>
        </div>
      </section>

      <Section className="pt-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <MapPin className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink-900">Our Office</h3>
              <p className="mt-1.5 text-sm text-ink-500">
                4th Floor, Learning Hub, Outer Ring Road, Bengaluru, Karnataka, India 560103
              </p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Mail className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink-900">Email Us</h3>
              <a href="mailto:hello@skillora.com" className="mt-1.5 block text-sm text-ink-500 hover:text-brand-600">
                hello@skillora.com
              </a>
              <a href="mailto:support@skillora.com" className="text-sm text-ink-500 hover:text-brand-600">
                support@skillora.com
              </a>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Phone className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink-900">Call Us</h3>
              <a href="tel:+911234567890" className="mt-1.5 block text-sm text-ink-500 hover:text-brand-600">
                +91 12345 67890
              </a>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
                <Clock className="h-3.5 w-3.5" /> Mon–Sat, 9:00 AM – 7:00 PM IST
              </p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <h3 className="font-display text-base font-bold text-ink-900">Follow Us</h3>
              <div className="mt-3 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition-colors hover:bg-brand-600 hover:text-white"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-ink-900">
                  Message sent successfully!
                </h3>
                <p className="mt-2 max-w-sm text-sm text-ink-500">
                  Thanks for reaching out. Our team will get back to you within one business day.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-ink-900">Send us a message</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Fill out the form below and we&apos;ll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-ink-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-ink-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="How can we help you?"
                      className="w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
                      {error}
                    </p>
                  )}

                  <Button type="submit" size="lg" className="w-full" icon={Send}>
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
