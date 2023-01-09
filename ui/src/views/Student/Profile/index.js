import { Box, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountProfile } from "./AccountProfile";
import { AccountProfileDetails } from "./AccountProfileDetail";

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
    let username = localStorage.getItem("username");
    let id = parseInt(username.substring(1));
    axios
      .get(`http://127.0.0.1:5000/student/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data)
      })
      .catch((error) => {
        localStorage.clear()
        navigate('/login')
        console.log(error)
      });
  }, [token, navigate]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{ mb: 3 }}
          variant="h4"
        >
          Personal Information
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <AccountProfile profile={profile}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <AccountProfileDetails profile={profile}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
