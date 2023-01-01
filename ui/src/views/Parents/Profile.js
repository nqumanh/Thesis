import { Box, Card, Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [profile, setProfile] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate()

    useEffect(() => {
        let id = localStorage.getItem("username");

        axios
            .get(`http://127.0.0.1:5000/parents/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setProfile(res.data)
            })
            .catch((error) => {
                console.log(error)
            });

        // let childId = parseInt(id.substring(1));
        // axios
        //     .get(`http://127.0.0.1:5000/student/${childId}`, {
        //         headers: { Authorization: `Bearer ${token}` },
        //     })
        //     .then((res) => {
        //         setChildInfo(res.data)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });

    }, [token, navigate]);

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
                    <div>Name: {profile.name}</div>
                    <div>Email: {profile.email}</div>
                    <div>Phone Number: {profile.phone_number}</div>
                    <div>Gender: {profile.gender}</div>
                    <div>Job: {profile.job}</div>
                    <div>Language: {profile.language}</div>
                    <div>Region: {profile.region}</div>
                    <div>Highest Education: {profile.highest_education}</div>
                </Box>
            </Card>

            {/* <Card sx={{ p: 3 }}>
                <Typography gutterBottom variant="h5" component="div">
                    Child's Information
                </Typography>

                <Box sx={{ mx: 3 }}>
                    <div>Student ID: {childInfo.id_student}</div>
                    <div>Name: {childInfo.name}</div>
                    <div>Gender: {childInfo.gender}</div>
                    <div>Region: {childInfo.region}</div>
                    <div>Highest Education: {childInfo.highest_education}</div>
                </Box>
            </Card> */}
        </Container>
    );
}
