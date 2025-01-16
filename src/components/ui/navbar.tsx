import { CubeIcon } from '@heroicons/react/20/solid'
import { Button } from './button'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    localStorage.removeItem('memory_lane_user')
    navigate('/login')
  }

  // Check if we're on login or signup pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/'

  return (
    <nav className='bg-white border-b border-gray-200 sticky w-full top-0 z-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <Link to='/' className='flex items-center'>
            <CubeIcon className='h-8 w-8 text-gray-900' />
            <span className='ml-2 text-xl font-semibold text-gray-900'>
              Memory Lane
            </span>
          </Link>

          {!isAuthPage && (
            <Button
              variant='ghost'
              onClick={handleSignOut}
              className='text-gray-600 hover:text-gray-900'
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
