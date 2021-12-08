import React from 'react';
import { Button, TextField, makeStyles, Paper } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import LoginImage from '../Assets/loginImage.svg';
import LoginRectangle from '../Assets/loginRectangle.svg';
import styles from '../Styles/LoginPage.module.css';
import authService from '../Services/Auth';

export default function loginPage(props) {
  const history = useHistory();

  const handleSubmit = () => {
    authService({
      username: props.username,
      password: props.password,
      setLogin: props.setLogin,
    });
    history.replace('/transaction');
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      borderRadius: '20px',
      boxShadow: '0px 0px 31px 13px rgba(0, 0, 0, 0.1)',
      marginLeft: '10%',
      marginTop: '6%',
      padding: '30px 20px 20px 30px',
      alignItems: 'center',
      width: '700px',
      height: '400px',
      top: '0',
      letf: '0',
      position: 'relative',
    },

    submit: {
      width: '300px',
      background: '#FFD037E0',
      color: '#000000',
      fontWeight: 'Bold',
      margin: theme.spacing(3, 0, 2),
    },

    form: {
      width: '100%', // Fix IE 11 issue.
      maxWidth: '300px',
      marginTop: '5%',
      zIndex: '6',
    },
  }));

  const classes = useStyles();
  return (
    <div className={styles.login}>
      <div className={styles.backgroundReactangleContainer}>
        <img
          className={styles.backgroundRecatngle}
          src={LoginRectangle}
          alt="BackgroundRectangle"
        />
      </div>
      <Paper className={classes.paper}>
        <form className={classes.form}>
          <TextField
            style={{ margin: '15px 0px', width: '100%' }}
            id="username-textfield"
            label="Username"
            variant="outlined"
            fullWidth
            value={props.username}
            onInput={(e) => props.setUsername(e.target.value)}
          />

          <TextField
            style={{ margin: '15px 0px', width: '100%' }}
            id="password-textfield"
            label="Password"
            variant="outlined"
            fullWidth
            value={props.password}
            type="password"
            onInput={(e) => props.setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!props.password || !props.username}
            className={classes.submit}
            onClick={handleSubmit}
          >
            Login
          </Button>

          <div className={styles.signUpText} style={{ padding: '5px', textAlign: 'center' }}>
            <span> Don&apos;t have an account ? </span>
            <Link to="/signup"> Sign Up Here </Link>
          </div>

          <h1 className={styles.loginTitle}>
            Hello&#44; <br /> Welcome back
          </h1>
        </form>
      </Paper>

      <div className={styles.backgroundImageContainer}>
        <img className={styles.backgroundImage} src={LoginImage} alt="Background" />
      </div>
    </div>
  );
}
