import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const TotalCourse = (props) => {
  const [totalCourse, setTotalCourse] = useState(0)
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = parseInt(username?.substring(1));
    let url = `http://localhost:5000/get-number-of-courses-of-educator/${id}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setTotalCourse(res.data);
      })
      .catch((error) => {
        console.log(error)
      });
  }, [role, token]);

  return (
    <Card
      sx={{ height: '100%' }}
      {...props}
    >
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
              TOTAL COURSE
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {totalCourse}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'warning.main',
                height: 56,
                width: 56
              }}
            >
              <School />
            </Avatar>
          </Grid>
        </Grid>
        {/* <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowDownwardIcon color="error" />
          <Typography
            color="error"
            sx={{
              mr: 1
            }}
            variant="body2"
          >
            12%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since last semester
          </Typography>
        </Box> */}
      </CardContent>
    </Card>
  )
};
