import swal from 'sweetalert2';
import axios from '../Config/Axios';

const authService = (props) => {
  axios
    .post('/api/auth/login', {
      username: props.username,
      password: props.password,
    })
    .then((res) => {
      window.sessionStorage.setItem('MoneyPlusPlusToken', JSON.stringify(res.data.token));
      window.sessionStorage.setItem('MoneyPlusPlusUsername', JSON.stringify(props.username));
      props.setLogin(true);
    })
    .catch(() => {
      swal.fire('Incorrect Username or Password :(');
    });
};

export default authService;
