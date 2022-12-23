import { Logout, Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header(props) {
    const { handleDrawerToggle } = props
    const drawerWidth = 240;
    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "white",
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <Menu />
                </IconButton>
                <Box justifyContent="end" sx={{ width: "100%", display: "flex" }}>
                    <IconButton onClick={() => logout()}>
                        <Logout />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;