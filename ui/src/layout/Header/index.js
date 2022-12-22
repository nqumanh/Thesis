import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { capitalizeFirstLetter } from 'utils';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const Header = (props) => {
    const { open, handleDrawerOpen } = props
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.clear()
        navigate('/login')
    }

    // const [name, setName] = useState('')
    const [messages, setMessages] = useState([])
    const [warnings, setWarnings] = useState([])
    const token = localStorage.getItem('token')

    const username = localStorage.getItem('username')
    const id = parseInt(username?.substring(1))
    // const role = capitalizeFirstLetter(localStorage.getItem('role'))

    useEffect(() => {
        axios
            .get(`http://localhost:5000/message/${username}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setMessages(response.data))
            .catch(error => console.log(error))
    }, [username, token])

    useEffect(() => {
        axios
            .get(`http://localhost:5000/warning/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setWarnings(response.data))
            .catch(error => console.log(error))
    }, [id, token])

    // useEffect(() => {
    //     let url = `http://localhost:5000/get-educator-name/${username}`
    //     if (role === 'Student') {
    //         url = `http://localhost:5000/get-student-name/${username}`
    //     }
    //     axios
    //         .get(url, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         })
    //         .then(response => setName(response.data.name))
    //         .catch(error => console.log(error))
    // }, [username, role, token])

    let contacts = messages.map(message => {
        if (username === message.sender_id)
            return {
                name: message.receiver_id,
                sender: 'You: ',
                message: message.message,
                created_time: message.created_time
            }
        return {
            name: message.sender_id,
            sender: '',
            message: message.message,
            created_time: message.created_time
        }
    })
    let unique = new Map()
    for (let i = 0; i < contacts.length; i++) {
        unique.set(contacts[i].name, contacts[i])
    }
    contacts = [...unique.values()]

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    Warning System
                </Typography>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit"
                        onClick={() => navigate('/message')}>
                        <Badge badgeContent={contacts.length} color="error">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        onClick={() => navigate('/warning')}
                    >
                        <Badge badgeContent={warnings.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() => navigate('/profile')}
                    >
                        <AccountCircle />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() => navigate('/setting')}
                    >
                        <SettingsIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={logOut}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header;