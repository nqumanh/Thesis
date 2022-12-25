import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function StudentResult() {
    const location = useLocation();
    const navigate = useNavigate()

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [assessments, setAssessments] = useState([]);
    const [prediction, setPrediction] = useState({})

    useEffect(() => {
        const codeModule = location.state.codeModule;
        const codePresentation = location.state.codePresentation;
        let id = location?.state.id;
        let url = `http://127.0.0.1:5000/student-assessment/${id}/${codeModule}/${codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                let assessments = response.data.map((row, index) => ({ id: index, ...row }))
                setAssessments(assessments)
            })
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });

        url = `http://127.0.0.1:5000/predict-student/${id}/${codeModule}/${codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setPrediction(res.data)
            })
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });
    }, [location.state, role, token, navigate]);

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
                    Student Detail
                </Typography>

                <Button
                    onClick={() => navigate("/course", {
                        state: {
                            presentation: {
                                codeModule: location.state.codeModule,
                                codePresentation: location.state.codePresentation,
                            }
                        }
                    })}
                    startIcon={<ArrowBack fontSize="small" />}
                >
                    Back to course information
                </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography gutterBottom variant="h5" component="div">
                                Student Status
                            </Typography>

                            <Stack direction="row" spacing={2}>
                                <Button variant='contained' color="error">Warn</Button>
                            </Stack>
                        </Stack>

                        <Stack spacing={3} direction="column" sx={{ m: 3 }}>
                            <Typography>Student Name: {prediction.name}</Typography>
                            <Typography>Student ID: {prediction.id}</Typography>
                            <Typography>Predicted as at risk: {prediction.isRisk}</Typography>
                            <Typography>Probability: {prediction.probability}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Assessment Result
                    </Typography>
                    <DataGridTable rows={assessments} columns={assessmentColumns} />
                </Card>
            </Box>
        </Container>
    );
}
