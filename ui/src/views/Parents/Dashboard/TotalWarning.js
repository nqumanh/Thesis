import { Avatar, Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Warning } from '@mui/icons-material';
import { getWarnings } from 'api';

export const TotalWarning = () => {
  const [totalWarning, setTotalWarning] = useState(0)
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = parseInt(username?.substring(1));
    getWarnings(id)
      .then((res) => {
        setTotalWarning(res.data.length);
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
              TOTAL WARNING
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
                {totalWarning}
              </Typography>
            }
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'error.main',
                height: 56,
                width: 56
              }}
            >
              <Warning />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};
