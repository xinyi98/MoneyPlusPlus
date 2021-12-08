import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { InputLabel, MenuItem, Select } from '@material-ui/core';
import {
  processDailyResponse,
  processCategoryResponse,
  getAllChartDataResponse,
} from '../Services/chartDataService';
import { getTotalPeriodData, getOverallBalanceData } from '../Services/OverallDataService';

import styles from '../Styles/TransactionPage.module.css';

export default function SummaryPage() {
  const [period, setPeriod] = useState('last_three_months');
  const [CWB, setCWB] = useState('0.00');
  const [TPC, setTPC] = useState('0.00');
  const [TPE, setTPE] = useState('0.00');
  const [TPI, setTPI] = useState('0.00');
  const [changesData, setChangesData] = useState({});
  const [incomeCategoryData, setIncomeCategoryData] = useState({});
  const [expenseCategoryData, setExpenseCategoryData] = useState({});

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const userToken = JSON.parse(sessionStorage.getItem('MoneyPlusPlusToken'));
    getAllChartDataResponse(period, userToken).then((responses) => {
      const [dailySummaryResponse, incomeCategoryResponse, expenseCategoryResponse] = responses;
      const newChangesData = processDailyResponse(dailySummaryResponse);
      const newIncomeCategoryData = processCategoryResponse(incomeCategoryResponse);
      const newExpenseCategoryData = processCategoryResponse(expenseCategoryResponse);
      setChangesData(newChangesData);
      setIncomeCategoryData(newIncomeCategoryData);
      setExpenseCategoryData(newExpenseCategoryData);
    });

    getTotalPeriodData(period, userToken).then((responses) => {
      const incomeTotalResponse = responses[0];
      const expenseTotalResponse = responses[1];
      const balanceResponse = responses[2];
      setTPI(incomeTotalResponse.data.result.toFixed(2));
      setTPE(expenseTotalResponse.data.result.toFixed(2));
      setTPC(balanceResponse.data.result.toFixed(2));
    });

    getOverallBalanceData(userToken).then((res) => {
      setCWB(res.data.result.toFixed(2));
    });
  }, [period]);

  const handleChangeOnPeriod = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.action}>
        <div className={styles.periodPicker}>
          <InputLabel id={styles.timeSelector}>Time Period:</InputLabel>
          <Select
            labelId="selectWeeks"
            id="demo-simple-select"
            value={period}
            onChange={handleChangeOnPeriod}
          >
            <MenuItem value="last_week">1 week</MenuItem>
            <MenuItem value="last_month">1 month</MenuItem>
            <MenuItem value="last_three_months">3 months</MenuItem>
            <MenuItem value="last_six_months">6 months</MenuItem>
            <MenuItem value="last_year">1 year</MenuItem>
          </Select>
        </div>
      </div>
      <div className={styles.result}>
        <div className={styles.widget}>
          <span>Current Wallet Balance</span>
          <div className={styles.balance}>{CWB} NZD</div>
        </div>
        <div className={styles.widget}>
          <span>Total Period Balance</span>
          <div className={styles.change}>{TPC} NZD</div>
        </div>
        <div className={styles.widget}>
          <span>Total Period Expenses</span>
          <div className={styles.expenses}>{TPE} NZD</div>
        </div>
        <div className={styles.widget}>
          <span>Total Period Income</span>
          <div className={styles.income}>{TPI} NZD</div>
        </div>
      </div>
      <div className={styles.graphContainer}>
        <span className={styles.graphTitle}>Changes</span>
        <div className={styles.chart}>
          <Bar data={changesData} options={options} />
        </div>
      </div>
      <div className={styles.graphContainer}>
        <span className={styles.graphTitle}>Categories</span>
        <div className={styles.categories}>
          <div className={styles.income}>
            <Pie
              data={incomeCategoryData}
              options={{
                ...options,
                plugins: { title: { display: true, text: 'Income Categories' } },
              }}
            />
          </div>
          <div className={styles.expenses}>
            <Pie
              data={expenseCategoryData}
              options={{
                ...options,
                plugins: { title: { display: true, text: 'Expense Categories' } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
