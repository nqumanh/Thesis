import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { Button } from "@mui/material";

export default function StudentResult() {
    const location = useLocation();
    console.log(location.state)
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        const codeModule = location.state.codeModule;
        const codePresentation = location.state.codePresentation;
        let id = location?.state.id;
        console.log("check", id)
        let url = `http://127.0.0.1:5000/student-assessment/${id}/${codeModule}/${codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                console.log(111111, response.data)
                let assessments = response.data.map((row, index) => ({ id: index, ...row }))
                setAssessments(assessments)
            })
            .catch((error) => console.log(error));
    }, [location.state, role, token]);

    const assessmentColumns = [
        {
            field: 'assessment_type',
            headerName: 'Assessment Type',
            width: 300,
        },
        {
            field: 'date_submitted',
            headerName: 'Date Submitted',
            width: 300,
        },
        {
            field: 'score',
            headerName: 'Score',
            width: 300,
        },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 300,
        },
    ];

    return (
        <div className="card m-4">
            <div className="card-body">
                <h2>Student Detail</h2>

                <DataGridTable rows={assessments} columns={assessmentColumns} />
                <Button variant="contained" color="error" sx={{mt: 3}}>
                    Warn this student
                </Button>
            </div>
        </div >
    );
}
