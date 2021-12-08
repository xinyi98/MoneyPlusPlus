import React, { useState, useEffect } from 'react';
import swal from 'sweetalert2';
import { TextField, Typography } from '@material-ui/core';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import axios from '../Config/Axios';
import CurrencyItem from '../Components/CurrencyItem';
import style from '../Styles/CurrencyPage.module.css';

export default function App() {
  const [currency, setCurrency] = useState([]);
  const [keyword, setKeyword] = useState('');
  // fetch the currency data
  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=nzd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
      )
      .then((res) => {
        setCurrency(res.data);
      })
      .catch(() => swal('Oops! there is an error getting currency info'));
  }, []);

  const findCurrency = currency.filter((c) => c.name.toUpperCase().includes(keyword.toUpperCase()));

  return (
    <div>
      <form>
        <TextField
          variant="outlined"
          placeholder="Search by name (e.g. bitcoin)"
          style={{ margin: '30px', width: '300px' }}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>
      <div className={style.titleContainer}>
        <div className={style.title}>
          <h3 style={{ marginLeft: '60px' }}>Cryptocurrency</h3>
          <h3 style={{ marginLeft: '230px' }}>Price</h3>
          <h3 style={{ marginLeft: '70px', marginRight: '90px' }}>Change(24h)</h3>
          <h3 style={{ marginRight: '90px' }}>Market Cap</h3>
        </div>
      </div>

      {currency.length !== 0 ? (
        findCurrency.map((c) => (
          <CurrencyItem
            key={c.id}
            name={c.name}
            price={c.current_price}
            symbol={c.symbol}
            marketCap={c.market_cap}
            image={c.image}
            change={c.price_change_percentage_24h.toFixed(3)}
          />
        ))
      ) : (
        <Typography variant="h5" style={{ marginTop: '15%' }}>
          Loading... If it takes too long, please try again later or contact our developers.
          <SentimentVeryDissatisfiedIcon />
        </Typography>
      )}
    </div>
  );
}
