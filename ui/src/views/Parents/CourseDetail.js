import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import { getCourseByCode, getStudentAssessments } from "api";
import DataGridTable from "components/DataGridTable";
import { addChannel, setCurrentChannel } from "features/message/messageSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";

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

function CourseDetailForParents() {
    const navigate = useNavigate()
    const location = useLocation();
    const token = localStorage.getItem("token");

    const codeModule = location.state.codeModule
    const codePresentation = location.state.codePresentation
    const studentId = location.state.studentId
    const [course, setCourse] = useState({})
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
        getStudentAssessments(studentId, codeModule, codePresentation)
            .then((res) => {
                setAssessments(res.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [codeModule, codePresentation, token, studentId]);

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
                        Assessment List
                    </Typography>
                    <DataGridTable rows={assessments} columns={assessmentColumns} />

                </Card>
            </Box>
        </Container>
    );
}

export default CourseDetailForParents;