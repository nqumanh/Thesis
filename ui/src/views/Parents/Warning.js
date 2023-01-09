import React, { useState, useEffect } from "react";
import DataGridTable from "components/DataGridTable"
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { addFeedbackToWarning, getWarnings } from "api";

const warningVisibility = {
    responseTime: false,
    createdTime: false,
}

const ParentsWarning = () => {
    const [warnings, setWarnings] = useState([]);
    let systemId = localStorage.getItem("id")
    const navigate = useNavigate()

    useEffect(() => {
        getWarnings(systemId).then((res) => {
            console.log(res.data)
            setWarnings(res.data)
        }).catch((error) => {
            console.log(error)
        });
    }, [systemId, navigate]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (id) => {
        setSelectedWarningId(id)
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedWarningId(null)
        setOpen(false);
    };

    const [selectedWarningId, setSelectedWarningId] = useState(null)
    const [feedback, setFeedback] = useState('')

    const columns = [
        {
            field: 'studentName',
            headerName: 'Student Name',
            width: 150,
            hideable: false
        },
        {
            field: 'studentId',
            headerName: 'Student ID',
            width: 100,
            hideable: false
        },
        {
            field: 'codeModule',
            headerName: 'Code Module',
            width: 100,
            hideable: false
        },
        {
            field: 'codePresentation',
            headerName: 'Code Presentation',
            width: 150,
            hideable: false
        },
        {
            field: 'content',
            headerName: 'Educator\'s Comment',
            width: 400,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'feedback',
            headerName: 'Feedback',
            width: 400,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                if (!params.value) {
                    return <Button onClick={() => handleClickOpen(params.id)}>Send a Feedback</Button>
                }
                else {
                    return params.value
                }
            }
        },
        {
            field: 'responseTime',
            headerName: 'Response Time',
            width: 150,
        },
        {
            field: 'createdTime',
            headerName: 'Created Time',
            width: 150,
        },
    ];

    const sendFeedback = () => {
        addFeedbackToWarning(selectedWarningId, feedback)
            .then((res) => {
                setWarnings(x => [res.data, ...x.filter(warning => warning.id !== selectedWarningId)])
                setOpen(false)
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <Container maxWidth={false}>
                <Box sx={{ mt: 3 }}>
                    <Card sx={{ p: 3 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            Warnings
                        </Typography>
                        <DataGridTable rows={warnings} columns={columns} visibility={warningVisibility} />
                    </Card>
                </Box>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please type your feedback below. Then we
                        will send it to your educator.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="feedback"
                        label=""
                        type="text"
                        fullWidth
                        variant="standard"
                        value={feedback}
                        onChange={(e) => { setFeedback(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => sendFeedback()}>Send</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ParentsWarning;