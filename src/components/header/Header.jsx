import React from 'react';
import { Box, Grid, AppBar, Toolbar, Paper, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';


export default function Header() {
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
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                                }}
                                alt="Paign Management logo"
                                src="https://campaignapistorage.blob.core.windows.net/media/organization_logos/Logo_RGB.png"/>
                            </Grid>
                            <Grid item lg={9}>
                                <Paper sx={paperStyles}>
                                    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
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
                                    </IconButton>
                                    <IconButton
                                    sx={{color: '#FF8D6B'}}>
                                        <SettingsIcon/>
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    );
}