import React from 'react'
import './StudentPage.css'
import { useParams } from 'react-router-dom'
import SideBar from '../../components/UserPage/SideBar/Sidebar'
import Header from '../../components/UserPage/Header/Header'
import Content from '../../components/UserPage/Content/Content'

export default function StudentPage () {
  const { id } = useParams()
  return (
    <div className='App'>
      <SideBar />
      <div className='MainFrame'>
        <Header userRole={'Student'} id={id}/>
        <Content userRole={`student`} id={id} />
      </div>
    </div>
  )
}
