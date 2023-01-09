import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, InputBase, NativeSelect, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getCourseListOfStudentByParentsId, getStudentAssessments } from "api";
import { ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '0px 26px 0px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

function AssessmentResult() {
    const theme = useTheme();
    const navigate = useNavigate();

    const personalId = localStorage.getItem('username');
    const [course, setCourse] = useState({ id: undefined })
    const [courses, setCourses] = useState([])
    const [assessments, setAssessments] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCourseListOfStudentByParentsId(personalId)
            .then((res) => {
                setCourses(res.data);
                if (res.data.length > 0) setCourse(res.data[0])
            })
            .catch((error) => {
                console.log(error)
            });
    }, [personalId])

    useEffect(() => {
        if (course.id !== undefined) {
            let selectedCourse = courses.find(x => x.id === parseInt(course.id))
            setLoading(true)
            getStudentAssessments(selectedCourse.studentId, selectedCourse.codeModule, selectedCourse.codePresentation)
                .then((res) => {
                    setAssessments(res.data)
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [courses, course])

    const handleChange = (e) => {
        setCourse(courses.find(x => x.id === parseInt(e.target.value)));
    };

    const data = {
        labels: assessments.map(x => x.assessment_type + ` (${x.date_submitted})`),
        datasets: [
            {
                fill: true,
                label: 'Score',
                data: assessments.map(x => x.score),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        animation: false,
        cornerRadius: 20,
        layout: { padding: 0 },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: true,
        xAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.secondary
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }
        ],
        yAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.secondary,
                    beginAtZero: true,
                    min: 0
                },
                gridLines: {
                    borderDash: [2],
                    borderDashOffset: [2],
                    color: theme.palette.divider,
                    drawBorder: false,
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                    zeroLineColor: theme.palette.divider
                }
            }
        ],
        tooltips: {
            backgroundColor: theme.palette.background.paper,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    };

    return (
        <Card>
            <CardHeader
                action={(
                    <NativeSelect
                        id="demo-customized-select-native"
                        value={course.id}
                        onChange={handleChange}
                        input={<BootstrapInput />}
                        sx={{ py: 0 }}
                    >
                        {courses.map(course =>
                            <option key={course.id} value={course.id}>
                                {course.studentName} - {course.name} - {course.codePresentation}
                            </option>
                        )}
                    </NativeSelect>
                )}
                title="Assessment Result"
            />
            <Divider />
            <CardContent>
                {loading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                        <CircularProgress />
                    </Box>
                    :
                    <Box
                        sx={{
                            height: 400,
                            position: 'relative'
                        }}
                    >
                        <Line options={options} data={data} />
                    </Box>
                }
            </CardContent>
            <Divider />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2
                }}
            >
                <Button
                    color="primary"
                    endIcon={<ArrowRight />}
                    size="small"
                    variant="text"
                    onClick={() => {
                        navigate(`/course`, {
                            state: { codeModule: course.codeModule, codePresentation: course.codePresentation, studentId: course.studentId }
                        })
                    }}
                >
                    Detail
                </Button>
            </Box>
        </Card>
    );
}

export default AssessmentResult;