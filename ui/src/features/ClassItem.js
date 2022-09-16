import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ClassItem (props) {
  const { presentation } = props

  let navigate = useNavigate()

  const viewCourseDetail = () =>
    navigate(`course`, {
      state: { presentation: presentation }
    })

  const items = [
    presentation.name,
    presentation.codeModule,
    presentation.codePresentation,
    presentation.major,
    presentation.year,
    presentation.monthStart,
    presentation.length,
    presentation.studentCount
  ]

  return (
    <tr onClick={() => viewCourseDetail()}>
      {[...items].map((item, index) => (
        <td className='align-middle' key={index}>
          {item}
        </td>
      ))}
    </tr>
  )
}
