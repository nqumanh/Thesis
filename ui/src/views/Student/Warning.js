import React, { useState, useEffect } from "react";
import DataGridTable from "components/DataGridTable"
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { addFeedbackToWarning, getWarnings } from "api";

const Warning = () => {
    const [warnings, setWarnings] = useState([]);
    let studentId = parseInt(localStorage.getItem("username").substring(1))
    const navigate = useNavigate()

    useEffect(() => {
        getWarnings(studentId).then((res) => {
            setWarnings(res.data)
        }).catch((error) => {
            console.log(error)
        });
    }, [studentId, navigate]);

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
            field: 'code_module',
            headerName: 'Course',
            width: 220,
            hideable: false
        },
        {
            field: 'code_presentation',
            headerName: 'Code Presentation',
            width: 220,
            hideable: false
        },
        {
            field: 'content',
            headerName: 'Educator\'s Comment',
            width: 500,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'studentResponse',
            headerName: 'Feedback',
            width: 500,
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
                        <DataGridTable rows={warnings} columns={columns} />
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

export default Warning;