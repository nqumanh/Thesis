import React from 'react'
import { Route, Routes } from 'react-router-dom'

import UserPage from './views/UserPage/UserPage'
import HomePage from './views/HomePage/HomePage'
import LoginPage from './views/LoginPage/LoginPage'
import StudentPage from './views/StudentPage/StudentPage'
import CourseDetailForStudent from './views/StudentPage/CourseDetailForStudent'

import 'bootstrap/dist/js/bootstrap.bundle';

export default function App () {
  return (
    <Routes>
      <Route exact path='/' element={<HomePage />} />

      <Route exact path='/login' element={<LoginPage />} />

      <Route exact path='/student/:id' element={<StudentPage />} />
      <Route
        exact
        path='/student/:id/course-detail'
        element={<CourseDetailForStudent />}
      />

      {/*  */}
      <Route exact path='/dashboard' element={<UserPage />} />
    </Routes>
  )
}
