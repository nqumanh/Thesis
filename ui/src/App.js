import React from 'react'
import { Route, Routes } from 'react-router-dom'

import HomePage from './views/HomePage'
import LoginPage from './views/LoginPage'
import ChangePasswordPage from './views/ChangePasswordPage'
import Dashboard from './layouts/dashboard'

import 'bootstrap/dist/js/bootstrap.bundle'

export default function App () {
  return (
    <Routes>
      <Route exact path='/' element={<HomePage />} />
      <Route exact path='/login' element={<LoginPage />} />
      <Route exact path='/change-password' element={<ChangePasswordPage />} />
      <Route exact path='/dashboard/*' element={<Dashboard />} />
    </Routes>
  )
}
