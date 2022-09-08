import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ClassItem (props) {
  const { presentation } = props

  let navigate = useNavigate()
  let location = useLocation()

  const viewCourseDetail = () =>
    navigate(`${location.pathname}/course-detail`, {
      state: { presentation: presentation }
    })

  return (
    <tr onClick={() => viewCourseDetail()}>
      <td className='align-middle'>{presentation.name}</td>
      <td className='align-middle'>{presentation.codeModule}</td>
      <td className='align-middle'>{presentation.codePresentation}</td>
      <td className='align-middle'>{presentation.major}</td>
      <td className='align-middle'>{presentation.year}</td>
      <td className='align-middle'>{presentation.monthStart}</td>
      <td className='align-middle'>{presentation.length}</td>
      <td className='align-middle'>{presentation.studentCount}</td>
    </tr>
  )
}
