import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/ui/navbar'
import { LoadingPage } from '@/components/loading'

const SignupPage = lazy(() => import('@/pages/SignupPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const MemoryLanePage = lazy(() => import('@/pages/MemoryLanePage'))
const EventPage = lazy(() => import('@/pages/EventPage'))

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path='/' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route
            path='/memory-lane/:memoryLaneId'
            element={<MemoryLanePage />}
          />
          <Route
            path='/memory-lane/:memoryLaneId/edit'
            element={<MemoryLanePage />}
          />
          <Route path='/event/:eventId' element={<EventPage />} />
          <Route path='/event/:eventId/edit' element={<EventPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  )
}

export default App
