import { Box, Button, Card, Container, Snackbar, TextField, Typography } from "@mui/material";
import axios from "axios";
import ChooseTheme from "views/Setting/ChooseTheme";
import MuiAlert from '@mui/material/Alert';
import React, { forwardRef, useState } from "react";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Setting = () => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    const [alert, setAlert] = useState({ message: "", type: "error" })
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "current-password":
                setCurrentPassword(value);
                break;
            case "new-password":
                setNewPassword(value);
                break;
            default:
                setConfirmPassword(value);
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setAlert({ message: "Password does not match", type: "error" })
            setOpen(true)
            return;
        }

        if (newPassword.length < 6) {
            setAlert({ message: "Password should have at least 6 digits!", type: "error" })
            setOpen(true)
            return;
        }

        let formData = new FormData();
        formData.append("username", username);
        formData.append("old_password", currentPassword);
        formData.append("new_password", newPassword);

        await axios
            .post("http://localhost:5000/edit-user-password", formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setNewPassword("")
                setConfirmPassword("")
                setCurrentPassword("")
                setAlert({ message: "Change password successfully!", type: "success" })
                setOpen(true)
            })
            .catch((error) => {
                setAlert({ message: error.response.data, type: "error" })
                setOpen(true)
            });
    };

    return (
        <Container maxWidth={false}>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
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
                    Settings
                </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Change Password
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{
                            width: '40%',
                            alignItems: 'center',
                        }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="current-password"
                                label="Password"
                                type="password"
                                id="current-password"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={onChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="new-password"
                                label="New Password"
                                type="password"
                                id="new-password"
                                value={newPassword}
                                autoComplete="new-password"
                                onChange={onChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirm-password"
                                label=" Confirm Password"
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                autoComplete="confirm-password"
                                onChange={onChange}
                            />
                            <input
                                type="text"
                                name="email"
                                autoComplete="username email"
                                style={{ display: "none" }}
                            ></input>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Theme
                    </Typography>
                    <ChooseTheme />
                </Card>
            </Box>
        </Container>
    );
}

export default Setting;