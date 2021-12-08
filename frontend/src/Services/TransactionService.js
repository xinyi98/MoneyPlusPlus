import swal from 'sweetalert2';
import axios from 'axios';

const TransactionService = (props) => {
  axios
    .post(
      '/api/financial-statement',
      {
        date: props.date,
        type: props.type,
        category: props.category,
        amount: props.amount,
        description: props.description,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.sessionStorage.getItem('MoneyPlusPlusToken')
          )}`,
        },
      }
    )
    .then(() => {
      swal.fire('New transaction added');
    })
    .catch(() => {
      swal.fire('Something went wrong, please try again later :(');
    });
};

export default TransactionService;
