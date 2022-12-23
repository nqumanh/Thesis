import { Box, Card, Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Profile() {
    const [profile, setProfile] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        let username = localStorage.getItem("username");
        let id = parseInt(username.substring(1));
        axios
            .get(`http://127.0.0.1:5000/student/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setProfile(response.data))
            .catch((error) => console.log(error));
    }, [token]);

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
                    Personal Information
                </Typography>
            </Box>


            <Card sx={{ p: 3 }}>
                <Typography gutterBottom variant="h5" component="div">
                    General Information
                </Typography>

                <Box sx={{ mx: 3 }}>
                    <div>ID: {profile.id_student}</div>
                    <div>Gender: {profile.gender}</div>
                    <div>Region: {profile.region}</div>
                    <div>Highest Education: {profile.highest_education}</div>
                </Box>
            </Card>
        </Container>
        // <div>
        //     <div>
        //         <div>
        //             <div>
        //                 <h2>Personal Information</h2>
        //                 <div>ID: {profile.id_student}</div>
        //                 <div>Gender: {profile.gender}</div>
        //                 <div>Region: {profile.region}</div>
        //                 <div>Highest Education: {profile.highest_education}</div>
        //             </div>
        //             <div>Avatar</div>
        //         </div>
        //     </div>
        // </div>
    );
}
