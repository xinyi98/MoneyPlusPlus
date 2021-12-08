import React, { useState } from 'react';
import { Button, TextField, makeStyles, Paper } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert2';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import styles from '../Styles/SignupPage.module.css';
import Logo from '../Assets/logo.svg';
import axios from '../Config/Axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: '20px',
    boxShadow: '0px 0px 31px 13px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    height: '550px',
    width: '400px',
    padding: '30px',
    margin: 'auto',
    marginTop: '45px',
  },

  submit: {
    width: '300px',
    background: '#FFD037E0',
    color: '#000000',
    fontWeight: 'Bold',
    margin: theme.spacing(3, 0, 3),
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    maxWidth: '300px',
    margin: 'auto',
    padding: '30px',
  },
}));

export default function signupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // this format string is used to detected whether it contains invalid characters
  const format = /[~` !@#$%^&*()+\-=[\]{};':"\\|,.<>\\/?]+/;
  const classes = useStyles();
  const history = useHistory();
  // submit the sign up request to database
  const submitSignup = (usrname, passwd) => {
    axios
      .post('api/auth/register', {
        username: usrname,
        password: passwd,
      })
      .then(() => {
        swal.fire('Your account has been created');
        history.push('/');
      })
      .catch(() => {
        swal.fire('Ooops something wrong ;( please another username');
      });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const submitHandler = (e) => {
    e.preventDefault();
    submitSignup(username, password);
  };

  return (
    <div className={styles.signup}>
      <Paper className={classes.paper}>
        <div>
          <div>
            <img className={styles.logo} src={Logo} alt="logo" />
          </div>
          <h1 style={{ fontSize: '3.3em' }}>Money++</h1>
        </div>
        <form className={classes.form}>
          <TextField
            style={{ margin: '15px 0px', width: '100%' }}
            id="username-textfield"
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            error={format.test(username)}
            helperText={
              format.test(username)
                ? 'Invalid Characters!'
                : '  ( only letters, numbers, and underscores )'
            }
            onInput={(e) => setUsername(e.target.value)}
          />

          <TextField
            style={{ margin: '15px 0px', width: '100%' }}
            id="password-textfield"
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!password || !username || format.test(username)}
            className={classes.submit}
            onClick={submitHandler}
          >
            Sign up
          </Button>

          <div style={{ padding: '5px', textAlign: 'center' }}>
            <span> Already have an account ? </span>
            <Link to="/"> Login Here </Link>
          </div>
        </form>
      </Paper>
    </div>
  );
}
