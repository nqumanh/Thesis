import { Avatar, Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const TotalCustomers = () => {
  const [totalStudent, setTotalStudent] = useState(0)
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = parseInt(username?.substring(1));
    let url = `http://localhost:5000/get-number-of-students-of-educator/${id}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setTotalStudent(res.data);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      });
  }, [token]);

  return (
    <Card
      sx={{ height: '100%' }}
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
              TOTAL STUDENTS
            </Typography>
            {loading ?
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
              :
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {totalStudent}
              </Typography>
            }
          </Grid>
          <Grid item>
            <Link to='/'>
              <Avatar
                sx={{
                  backgroundColor: 'success.main',
                  height: 56,
                  width: 56
                }}
              >
                <PeopleIcon />
              </Avatar>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};
