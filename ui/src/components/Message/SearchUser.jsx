import React, { useEffect, useMemo } from 'react';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { IconButton, InputBase, Paper } from '@mui/material';
import { ArrowBack, Search } from '@mui/icons-material';

function MyFormHelperText({ onSearch, setOnSearch }) {
    const { focused } = useFormControl() || {};

    useEffect(() => {
        if (focused)
            setOnSearch(true)
    }, [focused, setOnSearch])


    const helperText = useMemo(() => {
        if (onSearch) {
            return <IconButton sx={{ p: '10px', borderRadius: '50%', me: 2, my: 0 }} aria-label="back" onClick={() => setOnSearch(false)}>
                <ArrowBack />
            </IconButton>;
        }
        return '';
    }, [onSearch, setOnSearch]);

    return helperText;
}

export default function SearchUser({ onSearch, setOnSearch }) {
    return (
        <Box component="form" noValidate autoComplete="off" sx={{ my: 1 }}>
            <FormControl fullWidth>
                <Box display="flex" sx={{ mx: 1 }}>
                    <MyFormHelperText sx={{ me: 1 }} onSearch={onSearch} setOnSearch={setOnSearch} />
                    <Paper
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', backgroundColor: '#eee', borderRadius: '30px', flex: 1 }}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="search">
                            <Search />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1 }}
                            placeholder="Search User"
                            inputProps={{ 'aria-label': 'search User' }}
                        />
                    </Paper>
                </Box>
            </FormControl>
        </Box>
    );
}