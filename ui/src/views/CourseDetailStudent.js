import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { Box, Card, Container, Typography } from "@mui/material";

export default function CourseDetailStudent() {
    const location = useLocation();
    const course = location.state.presentation;
    const role = localStorage.getItem("role");
    const id = parseInt(localStorage.getItem("username").substring(1));
    const token = localStorage.getItem("token");

    const [materials, setMaterials] = useState([]);
    const [assessments, setAssessments] = useState([]);

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
        if (role === "student")
            url = `http://127.0.0.1:5000/student-assessment/${id}/${course.codeModule}/${course.codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                let assessments = response.data.map((row, index) => ({ id: index, ...row }))
                setAssessments(assessments)
            })
            .catch((error) => console.log(error));
    }, [id, role, course, token]);

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

    return (
        <Container maxWidth={false}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1
                }}
            >
                <Typography
                    sx={{ m: 1 }}
                    variant="h4"
                >
                    Course Information
                </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        General Information
                    </Typography>
                    <div>Course Name: {course.name}</div>
                    <div>Course Module: {course.codeModule}</div>
                    <div>Course Presentation: {course.codePresentation}</div>
                    <div>Major: {course.major}</div>
                    <div>Year: {course.year}</div>
                    <div>Starting Month: {course.monthStart}</div>
                    <div>Course Length (day): {course.length}</div>
                    <div>Number of students: {course.studentCount}</div>
                </Card>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Material List
                    </Typography>
                    <DataGridTable rows={materials} columns={materialColumns} />
                </Card>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Assessment List
                    </Typography>
                    <DataGridTable rows={assessments} columns={assessmentColumns} />

                </Card>
            </Box>
        </Container>
    );
}
