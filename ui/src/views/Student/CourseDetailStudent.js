import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getCourseByCode } from "api";
import { addChannel, setCurrentChannel } from "features/message/messageSlice";
import { v4 } from "uuid";

export default function CourseDetailStudent() {
    const location = useLocation();
    
    const id = parseInt(localStorage.getItem("username").substring(1));
    const token = localStorage.getItem("token");
    const codeModule = location.state.codeModule
    const codePresentation = location.state.codePresentation
    const [course, setCourse] = useState({})

    const navigate = useNavigate()

    const [materials, setMaterials] = useState([]);
    const [assessments, setAssessments] = useState([]);

    const channels = useSelector(state => state.message.channels)
    const dispatch = useDispatch()

    const handleSendMessage = () => {
        let channelId = channels.findIndex(channel => channel.userId === course.educatorSystemId)
        if (channelId === -1) {
            let newChannel = { id: v4(), userId: course.educatorSystemId, name: course.educatorName }
            dispatch(addChannel(newChannel))
            dispatch(setCurrentChannel(newChannel.id))
        } else {
            dispatch(setCurrentChannel(channels[channelId].id))
        }
        navigate('/message')
    }

    useEffect(() => {
        getCourseByCode(codeModule, codePresentation)
            .then((res) => {
                setCourse(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [codeModule, codePresentation])

    useEffect(() => {
        axios
            .get(
                `http://127.0.0.1:5000/materials/${codeModule}/${codePresentation}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => setMaterials(response.data))
            .catch((error) => {
                console.log(error)
            });
    }, [codeModule, codePresentation, token, navigate]);

    useEffect(() => {
        let url = `http://127.0.0.1:5000/student-assessment/${id}/${codeModule}/${codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                let assessments = response.data.map((row, index) => ({ id: index, ...row }))
                setAssessments(assessments)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [id, codeModule, codePresentation, token, navigate]);

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
                    <Stack direction="row" justifyContent="space-between">
                        <Typography gutterBottom variant="h5" component="div">
                            General Information
                        </Typography>
                        <Button variant='contained' color="secondary" onClick={() => handleSendMessage()}>Contact Educator</Button>
                    </Stack>
                    <div>Course Name: {course.name}</div>
                    <div>Course Module: {codeModule}</div>
                    <div>Course Presentation: {codePresentation}</div>
                    <div>Educator Name: {course.educatorName}</div>
                    <div>Major: {course.major}</div>
                    <div>Year: {course.year}</div>
                    <div>Starting Month: {course.monthStart}</div>
                    <div>Course Length (day): {course.length}</div>
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
