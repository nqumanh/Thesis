import React from 'react'
import { Route, Routes } from 'react-router-dom'

import HomePage from './views/HomePage'
import LoginPage from './views/LoginPage'
import Dashboard from './layouts/dashboard'

export default function App () {
  return (
    <Routes>
      <Route exact path='/' element={<HomePage />} />
      <Route exact path='/login' element={<LoginPage />} />
      <Route exact path='/dashboard/*' element={<Dashboard />} />
    </Routes>
  )
}
