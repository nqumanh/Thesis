import { Card, CardContent, CardHeader, CircularProgress, Divider, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function AssessmentChart() {
    const theme = useTheme();
    const token = localStorage.getItem('token');
    const [assessmentTypes, setAssessmentType] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const username = localStorage.getItem('username');
        const id = parseInt(username?.substring(1));
        let url = `http://localhost:5000/get-number-of-assessment-types-of-educator/${id}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setAssessmentType(res.data);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [token])

    const data = {
        labels: ['TMA', 'CMA', 'Exam'],
        datasets: [
            {
                data: [assessmentTypes.tma, assessmentTypes.cma, assessmentTypes.exam],
                backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
                borderWidth: 8,
                borderColor: '#FFFFFF',
                hoverBorderColor: '#FFFFFF'
            }
        ],
    };

    const devices = [
        {
            title: 'TMA',
            value: assessmentTypes.tma,
            color: '#3F51B5'
        },
        {
            title: 'CMA',
            value: assessmentTypes.cma,
            color: '#E53935'
        },
        {
            title: 'Exam',
            value: assessmentTypes.exam,
            color: '#FB8C00'
        }
    ];

    const options = {
        animation: false,
        cutoutPercentage: 80,
        layout: { padding: 0 },
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        responsive: true,
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
            <CardHeader title="Assessment Types" />
            <Divider />
            <CardContent>
                {loading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                        <CircularProgress />
                    </Box>
                    :
                    <>
                        <Box
                            sx={{
                                height: 300,
                                position: 'relative'
                            }}
                        >
                            <Doughnut data={data} options={options} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                pt: 2
                            }}
                        >
                            {devices.map(({
                                color,
                                icon: Icon,
                                title,
                                value
                            }) => (
                                <Box
                                    key={title}
                                    sx={{
                                        p: 1,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        {title}
                                    </Typography>
                                    <Typography
                                        style={{ color }}
                                        variant="h4"
                                    >
                                        {value}
                                        %
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </>
                }
            </CardContent>

        </Card>
    );
}

export default AssessmentChart;