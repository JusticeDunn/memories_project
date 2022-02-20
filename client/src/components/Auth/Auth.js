import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Icon from './icon';
import Input from './Input';
import { signin, signup } from '../../actions/auth';
import useStyles from './styles';

const initState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup]  = useState(false);
    const [formData, setFormData] = useState(initState);
    const dispatch = useDispatch();
    const history = useNavigate();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type: 'AUTH', data: { result, token }});

            history('/');
        } catch (err) {
            console.log(err);
        }
    };
    
    const googleFailure = (err) => {
        console.log(err);
        console.log("Google Sign In was unsuccessful. Try Again Later");
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>{isSignup ? "Sign Up" : "Sign In"}</Button>
                    <GoogleLogin 
                        clientId="196282241211-g6qbe1q6hgbopjba7jk3edakfl6ne6v9.apps.googleusercontent.com" 
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained" >
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;