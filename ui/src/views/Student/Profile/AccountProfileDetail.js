import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';

export const AccountProfileDetails = (props) => {

  const { profile } = props;

  return (
    <Card>
      <CardHeader
        subheader="Education"
        title="Profile"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              fullWidth
              label="Full name"
              name="name"
              required
              value={profile.name}
              variant="outlined"
              defaultValue="Name" 
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              fullWidth
              label="Student ID"
              name="studentId"
              value={profile.studentId}
              variant="outlined"
              defaultValue="Student ID"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={profile.email}
              variant="outlined"
              defaultValue="Email"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              fullWidth
              label="Highest Educator"
              name="phone"
              value={profile.highestEducation}
              variant="outlined"
              defaultValue="Highest Education"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              fullWidth
              label="Region"
              name="country"
              required
              value={profile.region}
              variant="outlined"
              defaultValue="Region"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <TextField
              fullWidth
              label="Gender"
              name="state"
              required
              value={profile.gender}
              variant="outlined"
              defaultValue="Gender"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
