import Courses from './views/Dashboard/Courses'
import Profile from './views/Dashboard/Profile'
import Warning from './views/Dashboard/Warning'
import Message from './views/Dashboard/Message'
import Security from './views/Dashboard/Security'
import CourseDetail from './views/Dashboard/Courses/CourseDetail'

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
  {
    name: 'Course Detail',
    layout: '/dashboard',
    path: '/course',
    element: CourseDetail
  }
]

export default routes
