import { Avatar, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Assessment } from '@mui/icons-material';
import { Box } from '@mui/system';
import { getNumberOfAssessmentsOfStudent } from 'api';
import { Link } from 'react-router-dom';

export const TotalAssessment = (props) => {
  const [totalAssessment, setTotalAssessment] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = parseInt(username?.substring(1));
    getNumberOfAssessmentsOfStudent(id)
      .then((res) => {
        setTotalAssessment(res.data.totalSubmission);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);

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
              Total Submitted Assessment
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
                {totalAssessment}
              </Typography>
            }
          </Grid>
          <Grid item>
            <Link to='/'>
              <Avatar
                sx={{
                  backgroundColor: 'primary.main',
                  height: 56,
                  width: 56
                }}
              >
                <Assessment />
              </Avatar>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};
