import { CssBaseline, styled } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
}));

const Dashboard = () => {

  const drawerWidth = 240;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  let token = localStorage.getItem("token")

  if (token == null) {
    return <Navigate to="/login" replace />;
  } else
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <Header handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />

        <Sidebar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />

        <DashboardLayoutRoot>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
          >
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </DashboardLayoutRoot>
      </Box>
    );

}

export default Dashboard;