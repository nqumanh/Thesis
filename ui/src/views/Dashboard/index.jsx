import React, { useState, useEffect } from "react";
import TableData from "features/TableData";
import Pagination from "components/Table/Pagination";
import axios from "axios";

export default function Dashboard() {
  const role = sessionStorage.getItem("role");
  const [courses, setCourses] = useState([]);

  const initialPagination = {
    rowsPerPage: 5,
    currentPage: 1,
  };
  const [pagination, setPagination] = useState(initialPagination);

  const paginate = (pageNumber, rowsPerPage) => {
    setPagination({
      rowsPerPage:
        rowsPerPage === "All" ? courses.length : parseInt(rowsPerPage),
      currentPage: pageNumber,
    });
  };

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const id = parseInt(username.substring(1));
    let url =
      role === "student"
        ? `http://127.0.0.1:5000/student-register/${id}`
        : `http://localhost:5000/get-courses-of-educator/${id}`;
    axios
      .get(url)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => console.log(error));
  }, [role]);

  const indexOfLastCourse = pagination.currentPage * pagination.rowsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - pagination.rowsPerPage;
  let presentations = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  return (
    <div>
      <div style={{ padding: "30px" }}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Course List</h5>
            <TableData presentations={presentations} />
            <Pagination
              rowsPerPage={pagination.rowsPerPage}
              totalCourses={courses.length}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
