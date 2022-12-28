import { Box, Container, Grid } from '@mui/material';
import { TotalCourse } from './TotalCourse';
import { TotalWarning } from './TotalWarning';
import { TotalAssessment } from './TotalAssessment';
import AssessmentChart from './AssessmentType';
import StudentAssessment from './StudentAssessment';

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
                        sm={4}
                        lg={4}
                        xl={4}
                        xs={12}
                    >
                        <TotalCourse />
                    </Grid>
                    <Grid
                        item
                        sm={4}
                        lg={4}
                        xl={4}
                        xs={12}
                    >
                        <TotalWarning />
                    </Grid>
                    <Grid
                        item
                        sm={4}
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
                        <StudentAssessment sx={{ height: '100%' }} />
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
