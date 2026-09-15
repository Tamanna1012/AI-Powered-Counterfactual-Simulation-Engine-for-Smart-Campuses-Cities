import { Navigate, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, Download, FileText } from 'lucide-react'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import { getCourseById } from '../data/courses'
import { useData } from '../context/DataContext'

export default function PaymentConfirmation() {
  const { courseId } = useParams()
  const location = useLocation()
  const course = getCourseById(courseId)
  const { purchaseHistory } = useData()

  const txn =
    location.state?.txn || purchaseHistory.find((t) => t.courseId === courseId)

  if (!course || !txn) return <Navigate to="/courses" replace />

  return (
    <Section className="bg-ink-50/40">
      <div className="mx-auto max-w-lg rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink-900">Payment Successful!</h1>
        <p className="mt-2 text-sm text-ink-500">
          You&apos;re all set. &quot;{course.title}&quot; has been added to your account.
        </p>

        <div className="mt-6 space-y-2 rounded-xl bg-ink-50 p-5 text-left text-sm">
          <Row label="Transaction ID" value={txn.id} />
          <Row label="Course" value={course.title} />
          <Row label="Amount Paid" value={`₹${txn.amount.toLocaleString('en-IN')}`} />
          <Row label="Payment Method" value={txn.method} />
          <Row
            label="Date"
            value={new Date(txn.date).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
          <Row label="Status" value="Success" highlight />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button to="/dashboard/student" className="flex-1">
            Go to My Courses
          </Button>
          <Button to="/courses" variant="outline" className="flex-1">
            Browse More Courses
          </Button>
        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600">
          <Download className="h-4 w-4" /> Download Receipt
        </button>
      </div>

      <p className="mx-auto mt-6 flex max-w-lg items-center justify-center gap-1.5 text-center text-xs text-ink-400">
        <FileText className="h-3.5 w-3.5" /> A confirmation email has been sent to your registered
        email address.
      </p>
    </Section>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={highlight ? 'font-semibold text-emerald-600' : 'font-medium text-ink-800'}>
        {value}
      </span>
    </div>
  )
}
