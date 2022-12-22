import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';

const darkTheme = createTheme({
    palette: {
        // mode: 'dark',
        mode: 'light',
    },
});

const Layout = () => {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Header handleDrawerOpen={handleDrawerOpen} open={open} />
                <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
                <Content />
            </ThemeProvider>
        </Box>
    );
}

export default Layout;