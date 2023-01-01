import { Box, Container, Grid } from '@mui/material';
import { TotalCourse } from './TotalCourse';
import { TotalWarning } from './TotalWarning';
import { ResponsePercentage } from './ResponsePercentage';
import AssessmentResult from './AssessmentResult';

const ParentsDashboard = () => (
    <>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            <Container>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        xl={4}
                        lg={4}
                        sm={6}
                        xs={12}
                    >
                        <TotalCourse />
                    </Grid>
                    <Grid
                        item
                        xl={4}
                        lg={4}
                        sm={6}
                        xs={12}
                    >
                        <TotalWarning />
                    </Grid>
                    <Grid
                        item
                        xl={4}
                        lg={4}
                        sm={6}
                        xs={12}
                    >
                        <ResponsePercentage />
                    </Grid>
                    <Grid
                        item
                        lg={12}
                        md={12}
                        xl={12}
                        xs={12}
                    >
                        <AssessmentResult sx={{ height: '100%' }} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </>
);

export default ParentsDashboard;
