import React from 'react'

import './Sidebar.css'

import HeaderSidebar from './HeaderSidebar/HeaderSidebar'
import SidebarNav from './SidebarNav/SidebarNav'

export default function Sidebar () {

  return (
    <div className='Sidebar'>
      <HeaderSidebar />
      <SidebarNav />
    </div>
  )
}
