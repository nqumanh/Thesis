import React, { useState } from 'react'
import ClassItem from './ClassItem'

export default function TableData (props) {
  const [filterName, setFilterName] = useState('')
  const [filterCodeModule, setFilterCodeModule] = useState('')
  const [filterMajor, setFilterMajor] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterMonthStart, setFilterMonthStart] = useState('All')

  const onChange = e => {
    const { name, value } = e.target

    props.onFilter(
      name === 'filterName' ? value : filterName,
      name === 'filterCodeModule' ? value : filterCodeModule,
      name === 'filterMajor' ? value : filterMajor,
      name === 'filterYear' ? value : filterYear,
      name === 'filterMonthStart' ? value : filterMonthStart
    )

    switch (name) {
      case 'filterName':
        setFilterName(value)
        break
      case 'filterCodeModule':
        setFilterCodeModule(value)
        break
      case 'filterMajor':
        setFilterMajor(value)
        break
      case 'filterYear':
        setFilterYear(value)
        break
      default:
        setFilterMonthStart(value)
        break
    }
  }

  const eleClassList = props.presentations.map((presentation, index) => {
    var id = presentation.codeModule + presentation.codePresentation
    return <ClassItem key={id} index={index} presentation={presentation} />
  })

  const headers = [
    'Course',
    'Code Module',
    'Code Presentation',
    'Major',
    'Year',
    'Month Start',
    'Length',
    'Student Count'
  ]

  return (
    <table className='table table-bordered table-striped table-hover'>
      <thead>
        <tr>
          {[...headers].map((header, index) => (
            <th scope='col' key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                name='filterName'
                value={filterName}
                onChange={onChange}
              ></input>
            </div>
          </td>
          <td>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                name='filterCodeModule'
                value={filterCodeModule}
                onChange={onChange}
              ></input>
            </div>
          </td>
          <td></td>
          <td>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                name='filterMajor'
                value={filterMajor}
                onChange={onChange}
              ></input>
            </div>
          </td>
          <td>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                name='filterYear'
                value={filterYear}
                onChange={onChange}
              ></input>
            </div>
          </td>
          <td>
            <select
              className='form-select'
              name='filterMonthStart'
              value={filterMonthStart}
              onChange={onChange}
            >
              <option defaultValue='All'>All</option>
              <option defaultValue='February'>February</option>
              <option value='October'>October</option>
            </select>
          </td>
          <td></td>
          <td></td>
        </tr>
        {eleClassList}
      </tbody>
    </table>
  )
}
