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

    if (name === 'filterName') {
      setFilterName(value)
    }
    if (name === 'filterCodeModule') {
      setFilterCodeModule(value)
    }
    if (name === 'filterMajor') {
      setFilterMajor(value)
    }
    if (name === 'filterYear') {
      setFilterYear(value)
    }
    if (name === 'filterMonthStart') {
      setFilterMonthStart(value)
    }
  }

  const eleClassList = props.presentations.map((presentation, index) => {
    var id = presentation.codeModule + presentation.codePresentation
    return <ClassItem key={id} index={index} presentation={presentation} />
  })

  return (
    <table className='table table-bordered table-striped table-hover'>
      <thead>
        <tr>
          <th scope='col'>Course</th>
          <th scope='col'>Code Module</th>
          <th scope='col'>Code Presentation</th>
          <th scope='col'>Major</th>
          <th scope='col'>Year</th>
          <th scope='col'>Month Start</th>
          <th scope='col'>Length</th>
          <th scope='col'>Student Count</th>
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
