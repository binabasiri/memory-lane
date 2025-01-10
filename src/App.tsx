import { CubeIcon } from '@heroicons/react/20/solid'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function Home() {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow h-96'>
      <div className='px-4 py-5 sm:p-6'>
        <div className='flex items-center'>
          <CubeIcon className='h-16 w-16 inline-block' />
          <h1 className='text-4xl font-semibold text-gray-900 mb-4 ml-4 mt-4'>
            Memory lane
          </h1>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div>
      <nav className='bg-gray-800 p-4'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Link to='/' className='text-white hover:text-gray-300'>
                Home
              </Link>
              <Link to='/events' className='text-white hover:text-gray-300'>
                Events
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/events'
            element={<div>Events page coming soon...</div>}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
