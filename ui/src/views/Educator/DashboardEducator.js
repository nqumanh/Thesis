import { useEffect, useState } from "react";
import axios from 'axios'
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const DashboardEducator = () => {
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(5);

    const role = localStorage.getItem('role');
    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const username = localStorage.getItem('username');
        const id = parseInt(username?.substring(1));
        let url = `http://localhost:5000/get-courses-of-educator/${id}`;
        axios
            .get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                setCourses(response.data);
            })
            .catch((error) => console.log(error));
    }, [role, token]);

    const courseColumns = [
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
            state: { presentation: params.row }
        })
    };

    return (
        <Card sx={{ overflow: 'hidden' }}>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
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
                />
            </div>
        </Card>
    )
}

export default DashboardEducator;