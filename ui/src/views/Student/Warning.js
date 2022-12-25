import React, { useState, useEffect } from "react";
import axios from "axios";
import DataGridTable from "components/DataGridTable"
import { useNavigate } from "react-router-dom";

const Warning = () => {
    const [warnings, setWarnings] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate()

    useEffect(() => {
        let username = localStorage.getItem("username");
        let id = username.substring(1);
        axios
            .get(`http://localhost:5000/warning/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                let warnings = response.data.map((warn, index) => ({ id: index, ...warn }))
                setWarnings(warnings)
            })
            .catch((error) => {
                localStorage.clear()
                navigate('/login')
                console.log(error)
            });
    }, [token, navigate]);

    const columns = [
        {
            field: 'code_module',
            headerName: 'Code Module',
            width: 300,
            hideable: false
        },
        {
            field: 'code_presentation',
            headerName: 'Code Presentation',
            width: 300,
            hideable: false
        },
        {
            field: 'content',
            headerName: 'Content',
            width: 300,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 300,
        },
    ];

    return (
        <div>
            <div className="card m-4">
                <div className="card-body">
                    <h2>Warnings</h2>
                    <DataGridTable rows={warnings} columns={columns} />
                </div>
            </div>
        </div>
    );
}

export default Warning;