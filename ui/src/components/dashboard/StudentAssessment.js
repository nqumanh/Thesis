import { Box, Card, CardContent, CardHeader, Divider, InputBase, NativeSelect, styled, useTheme } from "@mui/material";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
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

function StudentAssessment() {
    const theme = useTheme();
    const token = localStorage.getItem('token');
    const [courseId, setCourseId] = useState("")
    const [courses, setCourses] = useState([])
    const [assessments, setAssessments] = useState([])

    useEffect(() => {
        const username = localStorage.getItem('username');
        const id = parseInt(username?.substring(1));
        let url = `http://localhost:5000/get-courses-of-educator/${id}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setCourses(res.data);
                if (res.data.length > 0) setCourseId(res.data[0].id)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [token])

    useEffect(() => {
        if (courses.length > 0) {
            let id = parseInt(courseId)
            let codeModule = courses[id].codeModule
            let codePresentation = courses[id].codePresentation
            axios.get(`http://localhost:5000/get-assessment-statistics-in-course/${codeModule}/${codePresentation}`, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setAssessments(res.data);
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }, [courseId, courses, token])

    const data = {
        datasets: [
            {
                backgroundColor: '#3F51B5',
                barPercentage: 0.5,
                barThickness: 12,
                borderRadius: 4,
                categoryPercentage: 0.5,
                data: assessments.map(x => x.good),
                label: 'Good',
                maxBarThickness: 10
            },
            {
                backgroundColor: '#EEEEEE',
                barPercentage: 0.5,
                barThickness: 12,
                borderRadius: 4,
                categoryPercentage: 0.5,
                data: assessments.map(x => x.bad),
                label: 'Bad',
                maxBarThickness: 10
            }
        ],
        labels: assessments.map(x => x.assessment_type + ` (${x.date})`)
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

    const handleChange = (event) => {
        setCourseId(event.target.value);
    };

    return (
        <Card>
            <CardHeader
                action={(
                    <NativeSelect
                        id="demo-customized-select-native"
                        value={courseId}
                        onChange={handleChange}
                        input={<BootstrapInput />}
                        sx={{ py: 0 }}
                    >
                        {courses.map(course =>
                            <option key={course.id} value={course.id}>{course.name} {course.codePresentation}</option>
                        )}
                    </NativeSelect>
                )}
                title="Student Assessment Result"
            />
            <Divider />
            <CardContent>
                <Box
                    sx={{
                        height: 400,
                        position: 'relative'
                    }}
                >
                    <Bar
                        data={data}
                        options={options}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default StudentAssessment;