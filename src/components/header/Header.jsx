import React, { useState } from 'react';
import { 
    Box, 
    Grid, 
    AppBar, 
    Toolbar, Paper, 
    IconButton,  
    Popover, 
    Button, 
     
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../hooks/useAuth';


export default function Header() {
    const [openSettings, setOpenSettings] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const { logout } = useAuth()
    const { auth } = useAuth()

    const handleClick = (event) => {
      setOpenSettings(!openSettings)
      setAnchorEl(event.currentTarget)
    };
  
    const handleClose = () => {
      setAnchorEl(null)
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined


    const paperStyles = {
        position: 'absolute',
        right: '0',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        boxShadow: 'none',
        marginRight: 4
    }

    return (
        <div>
            <Box
                sx={{
                    height: '110px',
                    // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff'
                }}>
                <AppBar position="static" sx={{backgroundColor: 'white'}}>
                    <Toolbar>
                        <Grid container>
                            <Grid item lg={3}>
                                <Box
                                component="img"
                                sx={{
                                    height: 100,
                                    width: 'auto',
                                    paddingTop: "10px"
                                }}
                                alt="Marriott Bonvoy logo"
                                src="marbonlogo.png"/>
                            </Grid>
                            <Grid item lg={9}>
                                <Paper sx={paperStyles}>
                                    {/* <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
                                        <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search"
                                        inputProps={{ 'aria-label': 'search' }}
                                        />
                                    <SearchIcon />
                                    </Paper>
                                    <IconButton
                                    sx={{color: '#FF8D6B'}}>
                                        <NotificationsIcon/>
                                    </IconButton> */}
                                    { auth ?
                                    <IconButton
                                    onClick={handleClick}
                                    sx={{color: 'primary.main'}}>
                                        <SettingsIcon/>
                                    </IconButton>
                                    :null}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                {openSettings &&
                    <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                >
                    {/* <Typography sx={{ p: 2 }}>Settings</Typography> */}
                    <Button sx={{color: 'primary.main'}} onClick={logout}>Logout</Button>
                </Popover>}
            </Box>
        </div>
    );
}