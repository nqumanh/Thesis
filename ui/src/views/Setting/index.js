import { Box, Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import ChooseTheme from "components/ChooseTheme";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Setting = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

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
            alert("Password does not match!");
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
            .then((response) => {
                alert(response.data);
                navigate("/dashboard");
            })
            .catch((error) => alert(error.response.data));
    };

    return (
        <div>
            <h2>Change Password</h2>
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
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={onChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="new-password"
                        label="New Password"
                        type="password"
                        id="password"
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
                        id="password"
                        autoComplete="confirm-password"
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save Changes
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            {/* <Link href="#" variant="body2">
                                    Forgot password?
                                </Link> */}
                        </Grid>
                        <Grid item>

                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <h2>Change Theme Color</h2>
            <ChooseTheme />
        </div >
    );
}

export default Setting;