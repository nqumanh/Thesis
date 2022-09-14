import React from 'react'

import './Sidebar.css'

import HeaderSidebar from './HeaderSidebar'
import SidebarNav from './SidebarNav'

export default function Sidebar () {

  return (
    <div className='Sidebar'>
      <HeaderSidebar />
      <SidebarNav />
    </div>
  )
}
