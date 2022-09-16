// import Courses from './views/Dashboard/Courses'
import Dashboard from './views/Dashboard'
import Profile from './views/Dashboard/Profile'
import Warning from './views/Dashboard/Warning'
import Message from './views/Dashboard/Message'
import CourseDetail from './views/Dashboard/CourseDetail'

const routes = [
  {
    name: 'Default Dashboard',
    layout: '/dashboard',
    path: '/',
    element: Dashboard
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
    name: 'Course Detail',
    layout: '/dashboard',
    path: '/course',
    element: CourseDetail
  }
]

export default routes
