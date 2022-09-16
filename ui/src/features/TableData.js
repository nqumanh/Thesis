import React, { useState } from 'react'
import ClassItem from './ClassItem'
import { BiSortAlt2 } from 'react-icons/bi'
import { BsSortUpAlt, BsSortDown } from 'react-icons/bs'

export default function TableData (props) {
  const [filterName, setFilterName] = useState('')
  const [filterCodeModule, setFilterCodeModule] = useState('')
  const [filterMajor, setFilterMajor] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterMonthStart, setFilterMonthStart] = useState('')

  const [sortBy, setSortBy] = useState({ id: null, value: false })

  const onChange = e => {
    const { name, value } = e.target
    if (name === 'filterName') setFilterName(value)
    if (name === 'filterCodeModule') setFilterCodeModule(value)
    if (name === 'filterMajor') setFilterMajor(value)
    if (name === 'filterYear') setFilterYear(value)
    if (name === 'filterMonthStart') setFilterMonthStart(value)
  }
  let courses = props.presentations

  if (filterName) {
    courses = courses.filter(course => {
      return course.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    })
  }
  if (filterCodeModule) {
    courses = courses.filter(course => {
      return (
        course.codeModule
          .toLowerCase()
          .indexOf(filterCodeModule.toLowerCase()) !== -1
      )
    })
  }
  if (filterMajor) {
    courses = courses.filter(course => {
      return (
        course.major.toLowerCase().indexOf(filterMajor.toLowerCase()) !== -1
      )
    })
  }
  if (filterYear) {
    courses = courses.filter(course => {
      return course.year.toLowerCase().indexOf(filterYear.toLowerCase()) !== -1
    })
  }
  if (filterMonthStart) {
    courses = courses.filter(course => {
      return (
        course.monthStart
          .toLowerCase()
          .indexOf(filterMonthStart.toLowerCase()) !== -1
      )
    })
  }

  const eleClassList = courses.map((course, index) => {
    return <ClassItem key={index} presentation={course} />
  })

  const onSort = index => {
    let sortType = sortBy.id === index ? !sortBy.value : true
    courses.sort((a, b) => {
      if (sortType) {
        if (a[headerVariables[index]] < b[headerVariables[index]]) return -1
        return 1
      } else {
        if (a[headerVariables[index]] > b[headerVariables[index]]) return -1
        return 1
      }
    })
    setSortBy({ id: index, value: sortType })
  }

  const headerVariables = [
    'name',
    'codeModule',
    'codePresentation',
    'major',
    'year',
    'monthStart',
    'length',
    'studentCount'
  ]
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
            <th scope='col' key={index} onClick={() => onSort(index)}>
              {header}{' '}
              {sortBy.id !== index ? (
                <BiSortAlt2 />
              ) : sortBy.value ? (
                <BsSortUpAlt />
              ) : (
                <BsSortDown />
              )}
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
              <option value='February'>February</option>
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
