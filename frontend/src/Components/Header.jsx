import React from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { NavLink, useHistory } from 'react-router-dom';
import styles from '../Styles/Header.module.css';
import logo from '../Assets/logo.svg';

export default function Header(props) {
  const history = useHistory();
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
          <span>Money++</span>
        </div>
        <ul>
          <li>
            <NavLink activeClassName={styles.select} to="/transaction">
              Transaction
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={styles.select} to="/summary">
              Summary
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={styles.select} to="/currency">
              Currency
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={styles.select} to="/tips">
              Tips
            </NavLink>
          </li>
        </ul>
        <div className={styles.profile}>
          <Avatar>
            {JSON.parse(sessionStorage.getItem('MoneyPlusPlusUsername')).charAt(0).toUpperCase()}
          </Avatar>
          <span className={styles.name}>
            {window.sessionStorage.getItem('MoneyPlusPlusUsername').replace(/^"|"$/g, '')}
          </span>
          <IconButton
            aria-label="logout"
            color="inherit"
            onClick={() => {
              props.setLogin(false);
              window.sessionStorage.removeItem('MoneyPlusPlusToken');
              window.sessionStorage.removeItem('MoneyPlusPlusUsername');
              history.replace('/');
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
