import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { DataGrid, gridClasses, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport } from "@mui/x-data-grid";
import { alpha, Box, Button, Card, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, styled, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import { Close, Telegram } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addChannel, setCurrentChannel } from "features/message/messageSlice";
import { v4 } from "uuid";

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
    [`& .${gridClasses.row}.odd`]: {
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

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

export default function CourseDetailEducator() {
    const location = useLocation();
    const navigate = useNavigate()
    const channels = useSelector(state => state.message.channels)
    const dispatch = useDispatch()

    const course = location.state.presentation;
    const role = localStorage.getItem("role");
    const id = parseInt(localStorage.getItem("username").substring(1));
    const token = localStorage.getItem("token");

    const [presentation, setPresentation] = useState({})
    const [materials, setMaterials] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentListLoading, setStudentListLoading] = useState(false)

    const handleSendMessage = (e, id) => {
        e.stopPropagation();
        let channelId = channels.findIndex(channel => channel.userId === id)
        // console.log(0, channels)
        if (channelId === -1) {
            let newChannel = { id: v4(), userId: id, name: students.find(x => x.systemId === id).name }
            dispatch(addChannel(newChannel))
            dispatch(setCurrentChannel(newChannel.id))
        } else {
            dispatch(setCurrentChannel(channels[channelId].id))
        }
        navigate('/message')
    }

    const studentColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
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
            width: 100,
        },
        {
            field: 'age_band',
            headerName: 'Age band',
            width: 100,
        },
        {
            field: 'disability',
            headerName: 'Disability',
            width: 100,
        },
        {
            field: 'num_of_prev_attempts',
            headerName: 'Previous attempts',
            width: 150,
        },
        {
            field: 'is_risk',
            headerName: 'Is Risk',
            width: 100,
            renderCell: (params) => {
                return (params.value === "Yes") ? <Chip label="Yes" color="error" variant="outlined" /> : <Chip label="No" color="success" variant="outlined" />
            }
        },
        {
            field: 'is_warned',
            headerName: 'Is Warned',
            width: 100,
            renderCell: (params) => {
                return (params.value === 1) ? <DoneIcon color="success" /> : <Close color="error" />
            }
        },
        {
            field: 'systemId',
            headerName: 'Contact Student',
            width: 120,
            renderCell: (params) =>
                <IconButton aria-label="send message" onClick={(e) => handleSendMessage(e, params.value)}>
                    <Telegram color="primary" />
                </IconButton>
        },
    ];

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

    const [openWarnDialog, setOpenWarnDialog] = useState(false);

    const handleClickOpenWarnDialog = () => {
        setOpenWarnDialog(true);
    };

    const handleCloseWarnDialog = () => {
        setOpenWarnDialog(false);
    };

    const [openPredictDialog, setOpenPredictDialog] = useState(false);

    const handleClickOpenPredictDialog = () => {
        setOpenPredictDialog(true);
    };

    const handleClosePredictDialog = () => {
        setOpenPredictDialog(false);
    };

    const handlePredict = () => {
        setStudentListLoading(true)
        setOpenPredictDialog(false);
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

    const handleWarn = () => {
        setStudentListLoading(true)

        axios.put(`http://127.0.0.1:5000/warn-all-students`,
            { codeModule: course.codeModule, codePresentation: course.codePresentation },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => {
            setStudents(res.data)
            setStudentListLoading(false)
        }).catch((err) => {
            console.log(err)
        })
        setOpenWarnDialog(false);
    }

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
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color="secondary" />
                    </Box>
                    :
                    <Card sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography gutterBottom variant="h5" component="div">
                                Student List
                            </Typography>

                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" color="success" onClick={handleClickOpenPredictDialog}>Predict</Button>
                                <Button variant="contained" color="warning" onClick={handleClickOpenWarnDialog}>Warn All At-risk Students</Button>
                            </Stack>
                        </Stack>

                        <Dialog
                            open={openPredictDialog}
                            onClose={handleClosePredictDialog}
                            aria-labelledby="predict-dialog"
                            aria-describedby="confirm-predict-dialog"
                        >
                            <DialogTitle id="predict-dialog">
                                {"Generate predictions for all students"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="confirm-predict-dialog">
                                    Do you want to predict the performance of all students?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClosePredictDialog}>No</Button>
                                <Button onClick={() => handlePredict()} autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openWarnDialog}
                            onClose={handleCloseWarnDialog}
                            aria-labelledby="send-warning-dialog"
                            aria-describedby="confirm-warn-all-at-risk-students"
                        >
                            <DialogTitle id="send-warning-dialog">
                                {"Warn all at-risk students"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="confirm-warn-all-at-risk-students">
                                    Do you want to send messages to all at-risk students?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseWarnDialog}>Cancel</Button>
                                <Button onClick={() => handleWarn()} autoFocus>
                                    Submit
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
                                Toolbar: CustomToolbar,
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
        </Container >
    );
}
