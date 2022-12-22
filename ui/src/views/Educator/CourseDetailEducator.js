import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function CourseDetailEducator() {
    const location = useLocation();
    const course = location.state.presentation;
    const role = localStorage.getItem("role");
    const id = parseInt(localStorage.getItem("username").substring(1));
    const token = localStorage.getItem("token");

    const [materials, setMaterials] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios
            .get(
                `http://127.0.0.1:5000/materials/${course.codeModule}/${course.codePresentation}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => setMaterials(response.data))
            .catch((error) => console.log(error));
    }, [course, token]);

    useEffect(() => {
        let url = `http://127.0.0.1:5000/assessments/${course.codeModule}/${course.codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                let assessments = response.data.map((row, index) => ({ id: index, ...row }))
                setAssessments(assessments)
            })
            .catch((error) => console.log(error));
    }, [id, role, course, token]);

    useEffect(() => {
        axios
            .get(
                `http://127.0.0.1:5000/view-all-students/${course.codeModule}/${course.codePresentation}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => setStudents(response.data))
            .catch((error) => console.log(error));
    }, [course, token]);

    const assessmentColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 300,
            hideable: false
        },
        {
            field: 'assessment_type',
            headerName: 'Assessment Type',
            width: 300,
        },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 300,
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 300,
        },
    ];

    const materialColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 300,
            hideable: false
        },
        {
            field: 'activity_type',
            headerName: 'Activity Type',
            width: 300,
        },
        {
            field: 'week_from',
            headerName: 'From',
            width: 300,
        },
        {
            field: 'week_to',
            headerName: 'To',
            width: 300,
        },
    ];

    const studentColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            hideable: false
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            width: 150,
        },
        {
            field: 'highest_education',
            headerName: 'Highest Education',
            width: 300,
        },
        {
            field: 'imd_band',
            headerName: 'IMD band',
            width: 150,
        },
        {
            field: 'age_band',
            headerName: 'Age band',
            width: 150,
        },
        {
            field: 'disability',
            headerName: 'Disability',
            width: 150,
        },
        {
            field: 'num_of_prev_attempts',
            headerName: 'Previous attempts',
            width: 150,
        },
    ];

    const [pageSize, setPageSize] = useState(5);

    const navigate = useNavigate()

    const handleRowClick = (params) => {
        let id = params.row.id
        console.log(id)
        navigate(`student`, {
            state: {
                id: id,
                codeModule: course.codeModule,
                codePresentation: course.codePresentation,
            }
        })
    };

    return (
        <div className="card m-4">
            <div className="card-body">
                <a className="card-title" data-bs-toggle="collapse" href="#courseInfomation" role="button" aria-expanded="false" aria-controls="courseInfomation" style={{ textDecoration: "none", color: "#000", fontSize: "40px" }}>
                    Course Information
                </a>
                <div className="collapse ps-3 show" id="courseInfomation">
                    <div>Course Name: {course.name}</div>
                    <div>Course Module: {course.codeModule}</div>
                    <div>Course Presentation: {course.codePresentation}</div>
                    <div>Major: {course.major}</div>
                    <div>Year: {course.year}</div>
                    <div>Starting Month: {course.monthStart}</div>
                    <div>Course Length (day): {course.length}</div>
                    <div>Number of students: {course.studentCount}</div>
                </div>

                <hr />

                <DataGrid
                    rows={students}
                    columns={studentColumns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20, 100]}
                    pagination
                    autoHeight
                    onRowClick={handleRowClick}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                />

                <br />

                <DataGridTable rows={materials} columns={materialColumns} />

                <br />

                <DataGridTable rows={assessments} columns={assessmentColumns} />

            </div>
        </div >
    );
}
