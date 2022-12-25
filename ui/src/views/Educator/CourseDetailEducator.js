import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import { alpha, Box, Button, Card, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, styled, Typography } from "@mui/material";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
}));

export default function CourseDetailEducator() {
    const location = useLocation();
    const navigate = useNavigate()

    const course = location.state.presentation;
    const role = localStorage.getItem("role");
    const id = parseInt(localStorage.getItem("username").substring(1));
    const token = localStorage.getItem("token");

    const [presentation, setPresentation] = useState({})
    const [materials, setMaterials] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentListLoading, setStudentListLoading] = useState(false)

    useEffect(() => {
        axios
            .get(
                `http://127.0.0.1:5000/materials/${course.codeModule}/${course.codePresentation}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                setMaterials(response.data)
            })
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });

        axios
            .get(
                `http://127.0.0.1:5000/get-course/${course.codeModule}/${course.codePresentation}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                setPresentation(response.data)
            })
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });
    }, [course, token, navigate]);

    const [afterPredict, setAfterPredict] = useState(false)

    const handlePredict = () => {
        setStudentListLoading(true)
        axios.get(
            `http://127.0.0.1:5000/dynamic-predict/${course.codeModule}/${course.codePresentation}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then((res) => {
                setStudentListLoading(false)
                setAfterPredict(true)
            })
            .catch((error) => {
                console.log(error)
                setStudentListLoading(false)
                navigate('/login')
            });
    }

    useEffect(() => {
        let url = `http://127.0.0.1:5000/assessments/${course.codeModule}/${course.codePresentation}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                let assessments = response.data.map((row, index) => ({ id: index, ...row }))
                setAssessments(assessments)
            })
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });
    }, [id, role, course, token, navigate]);

    useEffect(() => {
        setStudentListLoading(true)
        axios
            .get(
                `http://127.0.0.1:5000/view-all-students/${course.codeModule}/${course.codePresentation}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                setStudents(res.data)
                setStudentListLoading(false)
                setAfterPredict(false)
            })
            .catch((error) => {
                setAfterPredict(false)
                setStudentListLoading(false)
                console.log(error)
                localStorage.clear()
                navigate('/login')
            });
    }, [course, token, navigate, afterPredict]);

    const assessmentColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 300,
            hideable: false
        },
        {
            field: 'assessment_type',
            headerName: 'Assessment Type',
            width: 300,
        },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 300,
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 300,
        },
    ];

    const materialColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 300,
            hideable: false
        },
        {
            field: 'activity_type',
            headerName: 'Activity Type',
            width: 300,
        },
        {
            field: 'week_from',
            headerName: 'From',
            width: 300,
        },
        {
            field: 'week_to',
            headerName: 'To',
            width: 300,
        },
    ];

    const studentColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            hideable: false
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            width: 75,
        },
        {
            field: 'highest_education',
            headerName: 'Highest Education',
            width: 200,
        },
        {
            field: 'imd_band',
            headerName: 'IMD band',
            width: 150,
        },
        {
            field: 'age_band',
            headerName: 'Age band',
            width: 150,
        },
        {
            field: 'disability',
            headerName: 'Disability',
            width: 150,
        },
        {
            field: 'num_of_prev_attempts',
            headerName: 'Previous attempts',
            width: 150,
        },
        {
            field: 'is_risk',
            headerName: 'Is Risk',
            width: 150,
            renderCell: (params) => {
                return (params.value === "Yes") ? <Chip label="Yes" color="error" variant="outlined" /> : <Chip label="No" color="success" variant="outlined" />
            }
        },
    ];

    const [pageSize, setPageSize] = useState(5);

    const handleRowClick = (params) => {
        navigate(`student`, {
            state: {
                id: params.row.id,
                codeModule: course.codeModule,
                codePresentation: course.codePresentation,
            }
        })
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth={false}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1
                }}
            >
                <Typography
                    sx={{ m: 1 }}
                    variant="h4"
                >
                    Course Information
                </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        General Information
                    </Typography>

                    <Typography>Course Name: {presentation.name}</Typography>
                    <Typography>Course Module: {presentation.codeModule}</Typography>
                    <Typography>Course Presentation: {presentation.codePresentation}</Typography>
                    <Typography>Major: {presentation.major}</Typography>
                    <Typography>Year: {presentation.year}</Typography>
                    <Typography>Starting Month: {presentation.monthStart}</Typography>
                    <Typography>Course Length (day): {presentation.length}</Typography>
                    <Typography>Number of students: {students.length}</Typography>
                </Card>
            </Box>


            <Box sx={{ mt: 3 }}>
                {studentListLoading ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress color="secondary" />
                    </Box>
                    :
                    <Card sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography gutterBottom variant="h5" component="div">
                                Student List
                            </Typography>

                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" color="success" onClick={() => handlePredict()}>Predict</Button>
                                <Button variant="contained" color="warning" onClick={handleClickOpen}>Warn All At-risk Student</Button>
                            </Stack>
                        </Stack>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Warn all at-risk students"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Do you want to send messages to all at-risk student?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>No</Button>
                                <Button onClick={handleClose} autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <StripedDataGrid
                            rows={students}
                            columns={studentColumns}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[5, 10, 20, 100]}
                            pagination
                            autoHeight
                            onRowClick={handleRowClick}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                            }
                        />
                    </Card>
                }
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Material List
                    </Typography>
                    <DataGridTable rows={materials} columns={materialColumns} />
                </Card>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Assessment List
                    </Typography>
                    <DataGridTable rows={assessments} columns={assessmentColumns} />

                </Card>
            </Box>
        </Container>
    );
}
