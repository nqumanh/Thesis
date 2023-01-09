import { Avatar, Box, Card, CardContent, CircularProgress, Grid, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Warning } from '@mui/icons-material';
import { getResponseWarningPercentage } from 'api';
import { Link } from 'react-router-dom';

export const ResponsePercentage = () => {
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = localStorage.getItem('id');
    getResponseWarningPercentage(id)
      .then((res) => {
        setLoading(false)
        setPercent(res.data.percent)
      }).catch((err) => {
        console.log(err)
      })
  }, []);

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
              RESPOND WARNING PERCENTAGE
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
                {percent}%
              </Typography>}
          </Grid>
          <Grid item>
            <Link to='/warning'>
              <Avatar
                sx={{
                  backgroundColor: 'success.main',
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
              value={percent}
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
