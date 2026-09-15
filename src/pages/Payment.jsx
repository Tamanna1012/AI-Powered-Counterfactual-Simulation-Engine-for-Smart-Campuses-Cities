import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Building2, CreditCard, Landmark, Lock, QrCode, ShieldCheck, Smartphone } from 'lucide-react'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import { getCourseById } from '../data/courses'
import { getIcon } from '../lib/icons'
import { courseGradients } from '../lib/theme'
import { useData } from '../context/DataContext'

const methods = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
]

export default function Payment() {
  const { courseId } = useParams()
  const course = getCourseById(courseId)
  const navigate = useNavigate()
  const { isPurchased, addPurchase } = useData()
  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  // Captured once on mount so a purchase made *during* this checkout (which
  // flips isPurchased) doesn't bounce this page back to the course before
  // the navigate() to the confirmation page has taken effect.
  const [alreadyOwned] = useState(() => (course ? isPurchased(course.id) : false))

  if (!course) return <Navigate to="/courses" replace />
  if (alreadyOwned) {
    return <Navigate to={`/courses/${course.slug}`} replace />
  }

  const Icon = getIcon(course.icon)

  function handlePay(e) {
    e.preventDefault()
    setProcessing(true)
    setTimeout(() => {
      const txn = addPurchase(course, methods.find((m) => m.id === method).label)
      navigate(`/payment/${course.id}/confirmation`, { state: { txn } })
    }, 1200)
  }

  return (
    <Section className="bg-ink-50/40">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-500">
            <Lock className="h-4 w-4" /> Secure Checkout
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">Complete Your Payment</h1>

          <div className="mt-6 flex gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                  method === m.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-ink-200 text-ink-500 hover:border-ink-300'
                }`}
              >
                <m.icon className="h-5 w-5" />
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handlePay} className="mt-6 space-y-4">
            {method === 'card' && (
              <>
                <Field label="Card Number" placeholder="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" placeholder="MM/YY" />
                  <Field label="CVV" placeholder="123" />
                </div>
                <Field label="Name on Card" placeholder="Your full name" />
              </>
            )}

            {method === 'upi' && (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink-200 bg-ink-50 py-8">
                <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-soft">
                  <QrCode className="h-8 w-8 text-ink-700" />
                </span>
                <p className="text-sm text-ink-500">Scan &amp; pay to</p>
                <p className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink-900 shadow-soft">
                  pay@skillora (Skillora Technologies Pvt. Ltd.)
                </p>
                <div className="w-full max-w-xs">
                  <Field label="Or enter UPI ID" placeholder="yourname@upi" />
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="rounded-xl border border-ink-200 p-4">
                <p className="mb-3 text-sm font-medium text-ink-700">Select your bank</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Other'].map((bank) => (
                    <label
                      key={bank}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-600 has-checked:border-brand-500 has-checked:bg-brand-50 has-checked:text-brand-700"
                    >
                      <input type="radio" name="bank" defaultChecked={bank === 'HDFC Bank'} className="accent-brand-600" />
                      <Building2 className="h-3.5 w-3.5" /> {bank}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={processing}>
              {processing ? 'Processing Payment…' : `Pay ₹${course.price.toLocaleString('en-IN')}`}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <ShieldCheck className="h-3.5 w-3.5" /> This is a prototype payment flow — no real
              transaction will be made.
            </p>
          </form>
        </div>

        <div className="h-fit rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold text-ink-900">Order Summary</h2>
          <div className="mt-4 flex items-center gap-3 border-b border-ink-100 pb-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white ${courseGradients[course.color] || courseGradients.brand}`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">{course.title}</p>
              <p className="text-xs text-ink-500">{course.category}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink-500">
              <span>Course Price</span>
              <span>₹{course.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>
                -₹{(course.originalPrice - course.price).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900">
              <span>Total</span>
              <span>₹{course.price.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <ul className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-xs text-ink-500">
            <li>Lifetime access to all course content</li>
            <li>Certificate of completion</li>
            <li>Downloadable notes &amp; practice quizzes</li>
          </ul>
        </div>
      </div>
    </Section>
  )
}

function Field({ label, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      <input
        required
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  )
}
