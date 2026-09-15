import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CheckCircle2, Lock, RotateCcw, Trophy, XCircle } from 'lucide-react'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import { getCourseById } from '../data/courses'
import { getQuizByCourseId } from '../data/quizzes'
import { useData } from '../context/DataContext'
import { useBuyNow } from '../hooks/useBuyNow'

export default function QuizAttempt() {
  const { courseId } = useParams()
  const course = getCourseById(courseId)
  const quiz = getQuizByCourseId(courseId)
  const { isPurchased, saveQuizResult } = useData()
  const buyNow = useBuyNow()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)

  if (!course || !quiz) return <Navigate to="/quiz" replace />

  const owned = isPurchased(course.id)

  if (!owned) {
    return (
      <Section>
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-ink-100 bg-white p-10 text-center shadow-soft">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400">
            <Lock className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold text-ink-900">Quiz Locked</h1>
          <p className="mt-2 text-sm text-ink-500">
            Purchase &quot;{course.title}&quot; to unlock this quiz and track your score.
          </p>
          <Button className="mt-6" onClick={() => buyNow(course)}>
            Buy Course to Unlock
          </Button>
        </div>
      </Section>
    )
  }

  const total = quiz.questions.length
  const question = quiz.questions[step]

  function selectAnswer(optionIndex) {
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = optionIndex
      return next
    })
  }

  function handleNext() {
    if (step < total - 1) {
      setStep((s) => s + 1)
    } else {
      const finalScore = answers.reduce(
        (sum, a, i) => sum + (a === quiz.questions[i].answerIndex ? 1 : 0),
        0,
      )
      saveQuizResult(course.id, finalScore, total)
      setSubmitted(true)
    }
  }

  function handleRetake() {
    setStep(0)
    setAnswers([])
    setSubmitted(false)
  }

  if (submitted) {
    const finalScore = answers.reduce(
      (sum, a, i) => sum + (a === quiz.questions[i].answerIndex ? 1 : 0),
      0,
    )
    const percent = Math.round((finalScore / total) * 100)
    return (
      <Section>
        <div className="mx-auto max-w-2xl rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <Trophy className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink-900">Quiz Completed!</h1>
          <p className="mt-2 text-ink-500">You scored</p>
          <p className="mt-1 font-display text-5xl font-extrabold text-brand-700">
            {finalScore}/{total}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink-500">{percent}% correct</p>

          <div className="mt-8 space-y-3 text-left">
            {quiz.questions.map((q, i) => {
              const correct = answers[i] === q.answerIndex
              return (
                <div key={i} className="rounded-xl border border-ink-100 p-4">
                  <div className="flex items-start gap-2.5">
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-rose-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink-800">{q.q}</p>
                      <p className="mt-1 text-xs text-ink-500">
                        Correct answer: <span className="font-semibold">{q.options[q.answerIndex]}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleRetake} variant="outline" icon={RotateCcw} iconPosition="left" className="flex-1">
              Retake Quiz
            </Button>
            <Button to="/dashboard/student" className="flex-1">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-ink-900">{quiz.title}</h1>
          <span className="text-sm font-medium text-ink-500">
            Question {step + 1} of {total}
          </span>
        </div>
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-500 to-violet-600 transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
          <p className="font-display text-lg font-bold text-ink-900">{question.q}</p>
          <div className="mt-5 space-y-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                  answers[step] === i
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-ink-200 text-ink-700 hover:border-ink-300'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    answers[step] === i ? 'border-brand-500 bg-brand-600 text-white' : 'border-ink-300 text-ink-400'
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={answers[step] === undefined}
            className="mt-7 w-full"
            size="lg"
          >
            {step < total - 1 ? 'Next Question' : 'Submit Quiz'}
          </Button>
        </div>
      </div>
    </Section>
  )
}
