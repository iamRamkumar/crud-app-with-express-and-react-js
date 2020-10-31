/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Cookies from 'js-cookie';
import { Grid } from '@material-ui/core';

export default function Login() {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState('');
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        let userLoggedin = typeof Cookies.get('isLoggedin') !== 'undefined' ? JSON.parse(Cookies.get('isLoggedin')) : false;
        setIsLoggedIn(userLoggedin);
        console.log('userLoggedin --->', userLoggedin);
        if (userLoggedin) {
            console.log('lllllllllllllll', window);
            window.location.href = '/dashboard';
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            window.location.href = '/dashboard';
        }
    }, [isLoggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const body = await response.json();

        if (body.isSuccess) {
            Cookies.set('userDetail', body.userDetail);
            Cookies.set('isLoggedin', body.isSuccess);
            setIsLoggedIn(body.isSuccess);
        }
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(1),
        },
        withoutLabel: {
            marginTop: theme.spacing(3),
        },
        textField: {
            width: '25ch',
        },
        paper: {
            padding: theme.spacing(5),
        }
    }));

    const classes = useStyles();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Paper className={classes.paper} elevation={24}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                            <OutlinedInput
                                type="text"
                                value={username}
                                onChange={e => setusername(e.target.value)}
                                labelWidth={70}
                            />
                        </FormControl>
                    </div>
                    <div>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                        </FormControl>
                    </div>

                    <div>
                        <Button variant="outlined" color="primary" type="submit">Submit</Button>
                    </div>

                </form>
                {/* <p>{worldResponse}</p> */}
            </Paper>
        </Grid>

    );
}