import React, { useState, useEffect } from 'react'
import './Content.css'
import TableData from './TableData'
import Pagination from './Pagination'

export default function Content () {
  const initialFilter = {
    name: '',
    codeModule: '',
    major: '',
    year: '',
    monthStart: 'All'
  }
  const initialPagination = {
    rowsPerPage: 5,
    currentPage: 1
  }

  const [presentations, setPresentations] = useState([])
  const [filter, setFilter] = useState(initialFilter)
  const [pagination, setPagination] = useState(initialPagination)

  useEffect(() => {
    const username = sessionStorage.getItem('username')
    const studentId = parseInt(username.substring(1))
    fetch(`http://127.0.0.1:5000/${'student-register/' + studentId}`).then(
      res =>
        res.json().then(data => {
          setPresentations(data)
        })
    )
  }, [])

  const onFilter = (
    filterName,
    filterCodeModule,
    filterMajor,
    filterYear,
    filterMonthStart
  ) => {
    setFilter({
      name: filterName,
      codeModule: filterCodeModule,
      major: filterMajor,
      year: filterYear,
      monthStart: filterMonthStart
    })
  }

  const paginate = (pageNumber, rowsPerPage) => {
    setPagination({
      rowsPerPage:
        rowsPerPage === 'All' ? presentations.length : parseInt(rowsPerPage),
      currentPage: pageNumber
    })
  }

  var courses = presentations
  if (filter) {
    if (filter.name) {
      courses = courses.filter(presentation => {
        return (
          presentation.name.toLowerCase().indexOf(filter.name.toLowerCase()) !==
          -1
        )
      })
    }
    if (filter.codeModule) {
      courses = courses.filter(presentation => {
        return (
          presentation.codeModule
            .toLowerCase()
            .indexOf(filter.codeModule.toLowerCase()) !== -1
        )
      })
    }
    if (filter.major) {
      courses = courses.filter(presentation => {
        return (
          presentation.major
            .toLowerCase()
            .indexOf(filter.major.toLowerCase()) !== -1
        )
      })
    }
    if (filter.year) {
      courses = courses.filter(presentation => {
        return (
          presentation.year
            .toString()
            .toLowerCase()
            .indexOf(filter.year.toLowerCase()) !== -1
        )
      })
    }
    if (filter.monthStart !== 'All') {
      courses = courses.filter(presentation => {
        return (
          presentation.monthStart
            .toLowerCase()
            .indexOf(filter.monthStart.toLowerCase()) !== -1
        )
      })
    }
  }

  //Pagination
  const indexOfLastCourse = pagination.currentPage * pagination.rowsPerPage
  const indexOfFirstCourse = indexOfLastCourse - pagination.rowsPerPage
  let currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse)

  return (
    <div className='Content mt-3'>
      {/* <h3>Student Dashboard</h3> */}
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          {/* <li className='breadcrumb-item'>
            <a href={`#/`}>Home</a>
          </li> */}
          <li className='breadcrumb-item active' aria-current='page'>
            All Courses
          </li>
        </ol>
      </nav>

      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title'>Course List</h5>
          <TableData presentations={currentCourses} onFilter={onFilter} />
          <Pagination
            rowsPerPage={pagination.rowsPerPage}
            totalCourses={presentations.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  )
}
