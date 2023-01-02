import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { Box, Button, Card, CardContent, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { getStudentById } from "api";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import { addChannel, setCurrentChannel } from "features/message/messageSlice";

const assessmentColumns = [
    {
        field: 'id_assessment',
        headerName: 'Assessment ID',
        width: 250,
    },
    {
        field: 'assessment_type',
        headerName: 'Assessment Type',
        width: 250,
    },
    {
        field: 'date_submitted',
        headerName: 'Date Submitted',
        width: 250,
    },
    {
        field: 'score',
        headerName: 'Score',
        width: 250,
    },
    {
        field: 'weight',
        headerName: 'Weight',
        width: 250,
    },
];

export default function StudentDetail() {
    const location = useLocation();
    const navigate = useNavigate()

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const id = location.state.id;
    const [assessments, setAssessments] = useState([]);
    const [prediction, setPrediction] = useState({ isRisk: "No", probability: 1 })
    const [student, setStudent] = useState({})
    const [open, setOpen] = useState(false);
    const [warnParentsDialog, setWarnParentsDialog] = useState(false);
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const channels = useSelector(state => state.message.channels)
    const dispatch = useDispatch()

    const contactParents = () => {
        let channelId = channels.findIndex(channel => channel.userId === student.parentsSystemId)
        if (channelId === -1) {
            let newChannel = { id: v4(), userId: student.parentsSystemId, name: student.parentsName }
            dispatch(addChannel(newChannel))
            dispatch(setCurrentChannel(newChannel.id))
        } else {
            dispatch(setCurrentChannel(channels[channelId].id))
        }
        navigate('/message')
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenParentsDiablog = () => {
        setWarnParentsDialog(true);
    };

    const handleCloseParentsDiablog = () => {
        setWarnParentsDialog(false);
    };

    useEffect(() => {
        const codeModule = location.state.codeModule;
        const codePresentation = location.state.codePresentation;
        let url = `http://127.0.0.1:5000/student-assessment/${id}/${codeModule}/${codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setAssessments(res.data)
            })
            .catch((error) => {
                console.log(error)
            });

        url = `http://127.0.0.1:5000/predict-student/${id}/${codeModule}/${codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setPrediction(res.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [location.state, role, token, navigate, id]);

    const handleWarn = () => {
        setLoading(true)
        axios.post(`http://127.0.0.1:5000/warn-student`,
            { id: id, codeModule: location.state.codeModule, codePresentation: location.state.codePresentation, email: student.email, content: content },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => {
            setPrediction(res.data)
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
            console.log(err)
        })
        setOpen(false)
    }

    const handleWarnParents = () => {
        setLoading(true)
        axios.post(`http://127.0.0.1:5000/WarnParents`,
            { 
                ParentsSystemId: student.parentsSystemId, 
                StudentId: id, 
                CodeModule: location.state.codeModule, 
                CodePresentation: location.state.codePresentation, 
                ParentsEmail: student.parentsEmail, 
                Content: content 
            },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => {
            setPrediction(res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
        setWarnParentsDialog(false)
    }

    useEffect(() => {
        getStudentById(id).then((res) => {
            setStudent(res.data)
        }).catch((err) => { console.log(err) })
    }, [id])

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
                    Student Information
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

            <Grid container spacing={3} >
                <Grid item lg={6} sm={6} xs={12}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Detail
                            </Typography>

                            <Stack direction="row" justifyContent="space-between">
                                <Box sx={{ mx: 2 }}>
                                    <Typography>Name: {student.name}</Typography>
                                    <Typography>Student ID: {student.studentId}</Typography>
                                    <Typography>Email: {student.email}</Typography>
                                    <Typography>Gender: {student.gender}</Typography>
                                    <Typography>Age band: {student.ageBand}</Typography>
                                    <Typography>Highest education: {student.highestEducation}</Typography>
                                    <Typography>IMD band: {student.imdBand}</Typography>
                                    <Typography>Disability: {student.disability}</Typography>
                                </Box>
                                <Stack direaction="column" justifyContent="space-between">
                                    <Box>
                                        <Typography>Parents: {student.parentsRelationship}</Typography>
                                        <Typography>Name: {student.parentsName}</Typography>
                                        <Typography>Personal Id: {student.parentsId}</Typography>
                                        <Typography>Email: {student.parentsEmail}</Typography>
                                        <Typography>Job: {student.parentsJob}</Typography>
                                        <Typography>Phone Number: {student.parentsPhonenumber}</Typography>
                                    </Box>
                                    <Button variant='contained' color="success" onClick={() => contactParents()}>
                                        Contact Parents
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6} sm={6} xs={12}>
                    {loading ?
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                        :
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography gutterBottom variant="h5" component="div">
                                        Performance
                                    </Typography>

                                    <Stack direction="row" spacing={2}>
                                        {
                                            prediction.isRisk !== "No" &&
                                            <Button variant='contained' color="warning" onClick={() => handleOpen()} disabled={prediction.isWarned === 1}>
                                                Warn
                                            </Button>
                                        }
                                        {
                                            prediction.isRisk !== "No" &&
                                            <Button variant='contained'
                                                color="error" disabled={prediction.isParentsWarned === 1}
                                                onClick={() => handleOpenParentsDiablog()}
                                            >
                                                Warn Parents
                                            </Button>
                                        }
                                    </Stack>
                                </Stack>

                                <Box sx={{ mx: 2 }}>
                                    <Typography>Is at risk: {prediction.isRisk}</Typography>
                                    <Typography>Probability: {prediction.probability * 100}%</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    }

                </Grid>
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Send Warning Message To Student</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please type your warning message below. Then we
                        will send it to the student.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="feedback"
                        label=""
                        type="text"
                        fullWidth
                        variant="standard"
                        value={content}
                        onChange={(e) => { setContent(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleWarn()}>Send Warning</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={warnParentsDialog} onClose={handleCloseParentsDiablog}>
                <DialogTitle>Send Warning Message To Parents</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please type your warning message below. Then we
                        will send it to the parents of the student.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="feedback"
                        label=""
                        type="text"
                        fullWidth
                        variant="standard"
                        value={content}
                        onChange={(e) => { setContent(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleWarnParents()}>Send Warning</Button>
                    <Button onClick={handleCloseParentsDiablog}>Cancel</Button>
                </DialogActions>
            </Dialog>

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
