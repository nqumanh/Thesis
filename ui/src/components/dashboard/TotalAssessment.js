import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Assessment } from '@mui/icons-material';

export const TotalAssessment = (props) => {
  const [totalAssessment, setTotalAssessment] = useState(0)
  const token = localStorage.getItem('token');

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = parseInt(username?.substring(1));
    let url = `http://localhost:5000/get-number-of-assessments-of-educator/${id}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setTotalAssessment(res.data);
      })
      .catch((error) => {
        console.log(error)
      });
  }, [token]);

  return (
    <Card {...props}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
            >
              Total Assessment
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {totalAssessment}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'primary.main',
                height: 56,
                width: 56
              }}
            >
              <Assessment />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};
