import { Box, Container, Grid } from '@mui/material';
import { TotalCourse } from 'components/dashboard/TotalCourse';
// import { Sales } from 'components/dashboard/sales';
// import { TrafficByDevice } from 'components/dashboard/traffic-by-device';
import { TasksProgress } from 'components/dashboard/AtRiskPercentage';
import { TotalCustomers } from 'components/dashboard/TotalStudent';
import { TotalAssessment } from 'components/dashboard/TotalAssessment';

const Dashboard = () => (
    <>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            <Container maxWidth={false}>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        sm={6}
                        lg={4}
                        xl={4}
                        xs={12}
                    >
                        <TotalCourse />
                    </Grid>
                    <Grid
                        item
                        sm={6}
                        lg={4}
                        xl={4}
                        xs={12}
                    >
                        <TotalCustomers />
                    </Grid>
                    <Grid
                        item
                        sm={6}
                        lg={4}
                        xl={4}
                        xs={12}
                    >
                        <TotalAssessment sx={{ height: '100%' }} />
                    </Grid>
                    <Grid
                        item
                        lg={8}
                        md={12}
                        xl={9}
                        xs={12}
                    >
                        {/* <Sales /> */}
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={6}
                        xl={3}
                        xs={12}
                    >
                        {/* <TrafficByDevice sx={{ height: '100%' }} /> */}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </>
);

export default Dashboard;
