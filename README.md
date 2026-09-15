# Skillora — EdTech Learning Platform

A modern, conversion-focused EdTech platform built for an internship prototype. Students, teachers,
associates, schools and colleges can explore courses, learn, teach and manage engagement — all
from one responsive React app.

## Tech Stack

- **React 19** + **Vite** (Rolldown-powered build)
- **React Router v7** for client-side routing (role-based protected routes)
- **Tailwind CSS v4** for styling (custom brand theme in `src/index.css`)
- **lucide-react** for icons
- **React Context + localStorage** for mock auth, purchases and quiz results (no backend yet)

## Getting Started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build
npm run preview    # preview the production build
npm run lint        # oxlint
```

## Project Structure

```
src/
  components/
    layout/     Navbar, Footer, Logo, page Layout
    ui/          Button, Badge, Section, Modal, StatCounter (shared primitives)
    home/        Homepage sections (Hero, Announcements, Featured Courses, ...)
    course/      CourseCard
    dashboard/   DashboardShell (sidebar), DashboardCard, StatTile, PanelCard
    auth/        AuthLayout (split-screen), LoginForm (role-aware)
    icons/       Inline SVG social icons (lucide-react no longer ships brand icons)
  context/       AuthContext (mock auth), DataContext (purchases, purchase history, quiz results)
  data/           Mock content: courses, testimonials, stats, announcements, notes, quizzes, services
  hooks/          useBuyNow (handles the buy-now -> login -> payment redirect flow)
  lib/            icons registry, role config, theme/gradient maps, progress helper, storage helper
  pages/          Route-level pages (Home, About, Services, Courses, CourseDetails, Notes, Quiz, ...)
    auth/         StudentLogin, TeacherLogin, AssociateLogin
    dashboard/    StudentDashboard, TeacherDashboard, AssociateDashboard
```

## How the Prototype Works

This is a **frontend-only prototype** — there is no real backend yet. To make the full user
journey demonstrable end-to-end, a few things are mocked:

- **Auth** (`AuthContext`): any email/password combination signs you in as that role (or use the
  "Continue with Demo Account" button on any login page). Session persists in `localStorage`.
- **Purchases & quiz results** (`DataContext`): stored per logged-in user in `localStorage`, so
  "My Courses", purchase history and quiz scores persist across reloads.
- **Payments** (`Payment.jsx`): a fully-designed checkout UI (Card / UPI / Net Banking) that
  simulates a payment after a short delay — no real transaction is made.
- **Course content**: 6 sample courses across College Education, School Education, Competitions
  and Skill Development, each with 3–5 video entries, notes and a quiz.

## Connecting a Real Backend Later

The app is structured so the mock layer is easy to swap out without touching UI components:

- Replace `src/data/*.js` with API calls (e.g. React Query / fetch) that return the same shapes.
- Replace `AuthContext`'s `login`/`logout` with real API calls (JWT/session-based), keeping the
  same `{ user, login, logout }` interface consumed by the rest of the app.
- Replace `DataContext`'s purchase/quiz-result functions with API calls; the rest of the app only
  depends on the `{ purchasedCourseIds, purchaseHistory, quizResults, isPurchased, addPurchase,
  saveQuizResult }` interface.
- Swap the mock payment form in `Payment.jsx` for a real gateway (Razorpay/Stripe/PayU) SDK —
  the surrounding order-summary UI and the `addPurchase` call site stay the same.
