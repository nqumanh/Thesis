import { useEffect, useState } from "react";
import { Box, Card, Container, styled, Typography, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import { getCourseListOfStudentByParentsId } from "api";

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

const ChildCourseList = () => {
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(5);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const personal_id = localStorage.getItem('username');
        getCourseListOfStudentByParentsId(personal_id)
            .then((response) => {
                setCourses(response.data);
            })
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });
    }, [navigate]);

    const courseColumns = [
        {
            field: 'studentName',
            headerName: 'Child Name',
            width: 300,
            hideable: false
        },
        {
            field: 'name',
            headerName: 'Course',
            width: 300,
            hideable: false
        },
        {
            field: 'codeModule',
            headerName: 'Code Module',
            width: 150
        },
        {
            field: 'codePresentation',
            headerName: 'Code Presentation',
            width: 150,
            hideable: false
        },
        {
            field: 'major',
            headerName: 'Major',
            width: 150
        },
        {
            field: 'year',
            headerName: 'Year',
            width: 150
        },
        {
            field: 'monthStart',
            headerName: 'Month Start',
            width: 150
        },
        {
            field: 'length',
            headerName: 'Length',
            width: 150
        }
    ];

    const handleRowClick = (params) => {
        navigate(`course`, {
            state: { codeModule: params.row.codeModule, codePresentation: params.row.codePresentation, studentId: params.row.studentId }
        })
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
                    Course List
                </Typography>
            </Box>

            <Card sx={{ overflow: 'hidden', mt: 3 }}>
                <div style={{ height: 400, width: '100%' }}>
                    <StripedDataGrid
                        rows={courses}
                        columns={courseColumns}
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
                </div>
            </Card>
        </Container>
    )
}

export default ChildCourseList;