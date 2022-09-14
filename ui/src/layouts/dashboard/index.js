import React from 'react'
import './dashboard.css'
import SideBar from './SideBar'
import Header from './Header'
import routes from 'routes'
import { Routes, Route } from 'react-router-dom'

export default function StudentPage () {
  return (
    <div className='App'>
      <SideBar />
      <div className='MainFrame'>
        <Header />
        <Routes>
          {routes.map((prop, key) => (
            <Route
              exact
              path={prop.path}
              element={<prop.element />}
              key={key}
            />
          ))}
        </Routes>
      </div>
    </div>
  )
}
