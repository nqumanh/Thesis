import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ClassItem (props) {
  const { presentation } = props

  let navigate = useNavigate()

  const viewCourseDetail = () =>
    navigate(`course`, {
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
