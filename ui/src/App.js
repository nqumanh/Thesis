import React from 'react'
import { Route, Routes } from 'react-router-dom'

import HomePage from './views/HomePage/HomePage'
import LoginPage from './views/LoginPage/LoginPage'
import StudentPage from './views/StudentPage/StudentPage'
import CourseDetailForStudent from './views/StudentPage/CourseDetailForStudent'
import Profile from './views/StudentPage/Profile'
import Message from './views/StudentPage/Message'
import Warning from './views/StudentPage/Warning'
import Security from './views/StudentPage/Security'
import Dashboard from './layouts/dashboard'

import 'bootstrap/dist/js/bootstrap.bundle'

export default function App () {
  return (
    <Routes>
      <Route exact path='/dashboard/*' element={<Dashboard />} />
      <Route exact path='/' element={<HomePage />} />

      <Route exact path='/login' element={<LoginPage />} />

      <Route exact path='/student' element={<StudentPage />} />
      <Route
        exact
        path='/student/:id/course-detail'
        element={<CourseDetailForStudent />}
      />
      <Route exact path='/student/:id/profile' element={<Profile />} />
      <Route exact path='/student/:id/message' element={<Message />} />
      <Route exact path='/student/:id/warning' element={<Warning />} />
      <Route exact path='/student/:id/security' element={<Security />} />
    </Routes>
  )
}
