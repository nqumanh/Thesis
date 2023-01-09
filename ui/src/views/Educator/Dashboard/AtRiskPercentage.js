import { Avatar, Box, Card, CardContent, CircularProgress, Grid, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Warning } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const AtRiskPercentage = () => {
  const [atRiskStudentNumber, setAtRiskStudentNumber] = useState(0)
  const [totalStudent, setTotalStudent] = useState(0)
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = parseInt(username?.substring(1));
    const fetchData = async () => {
      await axios
        .get(`http://localhost:5000/get-number-of-students-of-educator/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setTotalStudent(res.data);
        })
        .catch((error) => {
          console.log(error)
        });

      await axios
        .get(`http://localhost:5000/get-number-of-at-risk-students-of-educator/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setAtRiskStudentNumber(res.data);
          setLoading(false)
        })
        .catch((error) => {
          console.log(error)
        });
    }

    fetchData()
  }, [token]);

  let percentage = totalStudent === 0 ? 100 : (atRiskStudentNumber * 100 / totalStudent)

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
              AT RISK PERCENTAGE
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
                {percentage.toFixed(2)}%
              </Typography>}
          </Grid>
          <Grid item>
            <Link to='/'>
              <Avatar
                sx={{
                  backgroundColor: 'error.main',
                  height: 56,
                  width: 56
                }}
              >
                <Warning />
              </Avatar>
            </Link>
          </Grid>
        </Grid>
        {!loading &&
          <Box sx={{ pt: 3 }}>
            <LinearProgress
              value={Math.round(percentage)}
              variant="determinate"
              aria-busy="true"
              role="progressbar"
              aria-label="At Risk Percentage"
            />
          </Box>
        }
      </CardContent>
    </Card>
  )
};
