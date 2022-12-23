import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard/TotalCourse';
// import { Sales } from '../components/dashboard/sales';
// import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { TasksProgress } from '../components/dashboard/StudentSuccess';
import { TotalCustomers } from '../components/dashboard/TotalStudent';
import { TotalProfit } from '../components/dashboard/StudentImprovement';

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
                        lg={3}
                        sm={6}
                        xl={3}
                        xs={12}
                    >
                        <Budget />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <TotalCustomers />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <TasksProgress />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <TotalProfit sx={{ height: '100%' }} />
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
