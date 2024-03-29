import { Box, Container, Grid } from '@mui/material';
import { TotalCourse } from './TotalCourse';
import { TotalWarning } from './TotalWarning';
import { TotalAssessment } from './TotalAssessment';
import AssessmentChart from './AssessmentType';
import { ResponsePercentage } from './ResponsePercentage';
import AssessmentResult from './AssessmentResult';

const StudentDashboard = () => (
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
                        <TotalCourse />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <TotalWarning />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <ResponsePercentage />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
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
                        <AssessmentResult sx={{ height: '100%' }} />
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={6}
                        xl={3}
                        xs={12}
                    >
                        <AssessmentChart sx={{ height: '100%' }} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </>
);

export default StudentDashboard;
