import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import NavMenu from '../NavMenu';
import useStyles from './styles';


export default function Layout (props) {
    const classes = useStyles();
    return (
        <>
            <NavMenu loggedIn={props.loggedIn} classes={classes} />
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container className={classes.container}>
                <Grid container spacing={3}>
                    {/* Recent Orders */}
                    <Grid item xs={12}>
                        {/* <Paper elevation={3}> */}
                        {props.children}
                        {/* </Paper> */}
                    </Grid>
                </Grid>
                </Container>
            </main>
            
        </>
    );
}