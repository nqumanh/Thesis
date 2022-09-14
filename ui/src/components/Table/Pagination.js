import React, { useState } from 'react'

export default function Pagination (props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState('5')

  const changeRowsPerPage = event => {
    var rowsPerPage = event.target.value
    setCurrentPage(1)
    setSelectedRowsPerPage(rowsPerPage)
    props.paginate(1, rowsPerPage)
  }

  const toPreviousPage = e => {
    e.preventDefault()
    var newPage = currentPage - 1
    props.paginate(newPage, selectedRowsPerPage)
    setCurrentPage(newPage)
  }

  const toNextPage = e => {
    e.preventDefault()
    var newPage = currentPage + 1
    props.paginate(newPage, selectedRowsPerPage)
    setCurrentPage(newPage)
  }

  const paginate = (number, rowsPerPage) => {
    setCurrentPage(number)
    props.paginate(number, rowsPerPage)
  }

  const { rowsPerPage, totalCourses } = props

  const pageNumbers = []

  const length = Math.ceil(totalCourses / rowsPerPage)

  for (let i = 1; i <= length; i++) {
    pageNumbers.push(i)
  }

  var paginationNumber = pageNumbers.map(number => (
    <li
      key={number}
      className={number === currentPage ? 'page-item active' : 'page-item'}
    >
      <a
        href='/dashboard'
        className='page-link'
        onClick={e => {
          e.preventDefault()
          paginate(number, rowsPerPage)
        }}
      >
        {number}
      </a>
    </li>
  ))

  return (
    <div className='d-flex justify-content-between'>
      <div className='d-flex'>
        <label className='col-sm-7 col-form-label'>Rows per page:</label>
        <select
          className='form-select'
          name='rowsPerPage'
          value={selectedRowsPerPage}
          onChange={changeRowsPerPage}
        >
          <option defaultValue='5'>5</option>
          <option value='10'>10</option>
          <option value='15'>15</option>
          <option value='20'>20</option>
          <option value='All'>All</option>
        </select>
      </div>
      <nav>
        <ul className='pagination justify-content-end'>
          <li className='page-item'>
            <a
              className={currentPage === 1 ? 'page-link disabled' : 'page-link'}
              href='/dashboard'
              onClick={e => toPreviousPage(e)}
            >
              Previous
            </a>
          </li>
          {paginationNumber}
          <li className='page-item'>
            <a
              className={
                currentPage === length ? 'page-link disabled' : 'page-link'
              }
              href='/dashboard'
              onClick={e => toNextPage(e)}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
