import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const TotalCustomers = () => {
  const [totalStudent, setTotalStudent] = useState(0)
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = parseInt(username?.substring(1));
    let url = `http://localhost:5000/get-number-of-students-of-educator/${id}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setTotalStudent(res.data);
      })
      .catch((error) => {
        console.log(error)
      });
  }, [role, token]);

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
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {totalStudent}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'success.main',
                height: 56,
                width: 56
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};
