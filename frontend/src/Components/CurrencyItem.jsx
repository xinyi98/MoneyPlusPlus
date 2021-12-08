import React from 'react';
import style from '../Styles/CurrencyItem.module.css';

const CurrencyItem = ({ image, name, symbol, price, change, marketCap }) => (
  <div className={style.container}>
    <div className={style.eachLine}>
      <div className={style.info}>
        <img src={image} alt="currency" style={{ height: '50px', width: '50px' }} />
        <h3 style={{ width: '70px', marginLeft: '60px', marginRight: '60px' }}>
          {symbol.toUpperCase()}
        </h3>
        <p>{name}</p>
      </div>
      <div className={style.data}>
        <p style={{ width: '130px' }}>$ {price}</p>
        {change < 0 ? (
          <h4 style={{ color: ' #AE2C0C', width: '160px' }}>{change}%</h4>
        ) : (
          <h4 style={{ color: ' #479C0D', width: '160px' }}>{change}%</h4>
        )}
        <p style={{ width: '250px' }}>$ {marketCap.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

export default CurrencyItem;
