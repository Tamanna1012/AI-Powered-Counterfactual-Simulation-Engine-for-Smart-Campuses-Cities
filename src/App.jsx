import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import Notes from './pages/Notes'
import Quiz from './pages/Quiz'
import QuizAttempt from './pages/QuizAttempt'
import Payment from './pages/Payment'
import PaymentConfirmation from './pages/PaymentConfirmation'
import NotFound from './pages/NotFound'

import StudentLogin from './pages/auth/StudentLogin'
import TeacherLogin from './pages/auth/TeacherLogin'
import AssociateLogin from './pages/auth/AssociateLogin'

import StudentDashboard from './pages/dashboard/StudentDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import AssociateDashboard from './pages/dashboard/AssociateDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:slug" element={<CourseDetails />} />
              <Route path="notes" element={<Notes />} />
              <Route path="quiz" element={<Quiz />} />

              <Route path="login/student" element={<StudentLogin />} />
              <Route path="login/teacher" element={<TeacherLogin />} />
              <Route path="login/associate" element={<AssociateLogin />} />

              <Route
                path="quiz/:courseId"
                element={
                  <ProtectedRoute role="student">
                    <QuizAttempt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment/:courseId"
                element={
                  <ProtectedRoute role="student">
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment/:courseId/confirmation"
                element={
                  <ProtectedRoute role="student">
                    <PaymentConfirmation />
                  </ProtectedRoute>
                }
              />

              <Route
                path="dashboard/student"
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/teacher"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/associate"
                element={
                  <ProtectedRoute role="associate">
                    <AssociateDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
