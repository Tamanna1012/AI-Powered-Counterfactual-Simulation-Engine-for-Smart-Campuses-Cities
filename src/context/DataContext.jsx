import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

function emptyRecord() {
  return { courses: [], history: [], quizResults: {} }
}

function makeTxnId() {
  return 'TXN' + Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const key = user?.email || 'guest'

  const [store, setStore] = useState(() => readStorage('store', {}))

  useEffect(() => {
    writeStorage('store', store)
  }, [store])

  const record = store[key] || emptyRecord()

  function updateRecord(updater) {
    setStore((prev) => {
      const current = prev[key] || emptyRecord()
      return { ...prev, [key]: updater(current) }
    })
  }

  function isPurchased(courseId) {
    return record.courses.includes(courseId)
  }

  function addPurchase(course, method = 'Card') {
    const txn = {
      id: makeTxnId(),
      courseId: course.id,
      courseTitle: course.title,
      amount: course.price,
      method,
      date: new Date().toISOString(),
      status: 'Success',
    }
    updateRecord((current) => ({
      ...current,
      courses: current.courses.includes(course.id)
        ? current.courses
        : [...current.courses, course.id],
      history: [txn, ...current.history],
    }))
    return txn
  }

  function saveQuizResult(courseId, score, total) {
    updateRecord((current) => ({
      ...current,
      quizResults: {
        ...current.quizResults,
        [courseId]: { score, total, date: new Date().toISOString() },
      },
    }))
  }

  const value = useMemo(
    () => ({
      purchasedCourseIds: record.courses,
      purchaseHistory: record.history,
      quizResults: record.quizResults,
      isPurchased,
      addPurchase,
      saveQuizResult,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [record, key],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
