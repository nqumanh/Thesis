import React, { useState } from 'react'
import './UserPage.css'

import SideBar from '../../components/UserPage/SideBar/Sidebar'
import Header from '../../components/UserPage/Header/Header'
import Content from '../../components/UserPage/Content/Content'

export default function UserPage () {
  const [userRole] = useState('')
  return (
    <div className='App'>
      <SideBar />
      <div className='MainFrame'>
        <Header />
        <Content userRole={userRole} />
      </div>
    </div>
  )
}
