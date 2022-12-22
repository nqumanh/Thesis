import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function DataGridTable(props) {
    const [pageSize, setPageSize] = useState(5);
    const { rows, columns } = props;

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
            autoHeight
            components={{
                Toolbar: GridToolbar,
            }}
        />
    );
}
