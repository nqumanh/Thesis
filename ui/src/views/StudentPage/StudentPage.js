import React from 'react'
import './StudentPage.css'
import SideBar from '../../components/UserPage/SideBar/Sidebar'
import Header from '../../components/UserPage/Header/Header'
import Content from '../../components/UserPage/Content/Content'

export default function StudentPage () {
  return (
    <div className='App'>
      <SideBar />
      <div className='MainFrame'>
        <Header />
        <Content />
      </div>
    </div>
  )
}
