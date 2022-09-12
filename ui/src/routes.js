import Courses from './views/dashboard/Courses'
import Profile from './views/dashboard/Profile'
import Warning from './views/dashboard/Warning'
import Message from './views/dashboard/Message'
import Security from './views/dashboard/Security'

const routes = [
  {
    name: 'Courses',
    layout: '/dashboard',
    path: '/',
    element: Courses
  },
  {
    name: 'Profile',
    layout: '/dashboard',
    path: '/profile',
    element: Profile
  },
  {
    name: 'Warning',
    layout: '/dashboard',
    path: '/warning',
    element: Warning
  },
  {
    name: 'Message',
    layout: '/dashboard',
    path: '/message',
    element: Message
  },
  {
    name: 'Security',
    layout: '/dashboard',
    path: '/security',
    element: Security
  },
]

export default routes
