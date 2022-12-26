import { Warning } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';

export const TasksProgress = (props) => (
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
            AT RISK PERCENTAGE
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            75%
          </Typography>
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
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          value={75}
          variant="determinate"
          aria-busy="true"
          role="progressbar"
          aria-label="Success Percentage"
        />
      </Box>
    </CardContent>
  </Card>
);
