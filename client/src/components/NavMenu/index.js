/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


import { mainListItems, secondaryListItems } from './ListItem';

export default function NavMenu(props) {
    const { classes, loggedIn } = props;
    const [open, setOpen] = useState(loggedIn);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDaata, setUserDaata] = useState(false);

    useEffect(() => {
        let userLoggedin = typeof Cookies.get('isLoggedin') !== 'undefined' ? JSON.parse(Cookies.get('isLoggedin')) : false;
        setIsLoggedIn(userLoggedin);
        if (userLoggedin) {
            let userData = Cookies.get('userDetail') || '{}';
            setUserDaata(JSON.parse(userData));
        } else {
            setUserDaata({});
        }
    }, []);
    
    useEffect(() => {
        if (isLoggedIn) {
            let userData = Cookies.get('userDetail') || '{}';
            setUserDaata(JSON.parse(userData));
        } else {
            setUserDaata({});
        }
    }, [isLoggedIn]);

    const handleDrawerOpen = () => {
        console.log('handleDrawerOpen');
        setOpen(true);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const oopen = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        Cookies.remove('userDetail');
        Cookies.remove('isLoggedin');
        handleClose();
        window.location.href = '/';
    };

    const handleDrawerClose = () => {
        console.log('handleDrawerClose');
        setOpen(false);
    };
    return (
        <>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                            disabled={!loggedIn}
                        >
                            <MenuIcon />
                        </IconButton>
                    </>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {/* Dashboard */}
                        <br />
                    </Typography>
                    {isLoggedIn && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar alt="Cindy Baker" src={userDaata.picture} />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={oopen}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            {
                isLoggedIn ? (
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                        }}
                        open={open}
                    >
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>{mainListItems}</List>
                        <Divider />
                        <List>{secondaryListItems}</List>
                    </Drawer>
                ) : <></>
            }

        </>
    );
}