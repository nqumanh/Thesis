import { Avatar, Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getCourseListOfStudentByParentsId } from 'api';

export const TotalCourse = (props) => {
  const [totalCourse, setTotalCourse] = useState(0)
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem('username');
    getCourseListOfStudentByParentsId(username)
      .then((res) => {
        setTotalCourse(res.data.length);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      });
  }, [token]);

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
            {loading ?
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
              :
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {totalCourse}
              </Typography>
            }
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
      </CardContent>
    </Card>
  )
};
