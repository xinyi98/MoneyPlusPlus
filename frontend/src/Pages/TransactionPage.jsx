import React, { useState, useEffect } from 'react';
import { InputLabel, MenuItem, Select, Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TransactionTable from '../Components/TransactionTable';
import TransactionScreen from '../Components/TransactionScreen';
import { getTotalPeriodData, getOverallBalanceData } from '../Services/OverallDataService';
import { getBothSavingTarget, getSavingTarget } from '../Services/savingTargetService';
import styles from '../Styles/TransactionPage.module.css';
import SavingTargetWidget from '../Components/SavingTargetWidget';
import SetSavingTargetDialog from '../Components/SetSavingTargetDialog';

export default function TransactionPage() {
  const [getFlag, setGetFlag] = useState(false);
  const [period, setPeriod] = useState('all');
  const [openTargetDialog, setOpenTargetDialog] = useState(false);
  const [CWB, setCWB] = useState('0.00');
  const [TPE, setTPE] = useState('0.00');
  const [TPI, setTPI] = useState('0.00');
  const [TPC, setTPC] = useState('0.00');
  const [shortTermTarget, setShortTermTarget] = useState({});
  const [longTermTarget, setLongTermTarget] = useState({});

  useEffect(() => {
    const userToken = JSON.parse(sessionStorage.getItem('MoneyPlusPlusToken'));
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

    getBothSavingTarget(userToken).then((responses) => {
      const shortTermResponse = responses[0];
      const longTermResponse = responses[1];
      if (shortTermResponse.data.success && shortTermResponse.data.result) {
        setShortTermTarget(shortTermResponse.data.result);
      }
      if (longTermResponse.data.success && longTermResponse.data.result) {
        setLongTermTarget(longTermResponse.data.result);
      }
    });
  }, [period, getFlag]);

  const handleChangeOnPeriod = (event) => {
    setPeriod(event.target.value);
  };

  const handleSavingTargetCleanup = (type) => {
    getSavingTarget(JSON.parse(sessionStorage.getItem('MoneyPlusPlusToken')), type).then((res) => {
      if (res.data.success) {
        if (type === 'shortTerm') {
          setShortTermTarget(res.data.result);
        } else {
          setLongTermTarget(res.data.result);
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.action}>
        <TransactionScreen setGetFlag={setGetFlag} />
        <div style={{ marginLeft: '1%' }}>
          <Button
            variant="contained"
            color="default"
            startIcon={<AddCircleIcon />}
            onClick={() => setOpenTargetDialog(true)}
            disabled={
              Object.keys(longTermTarget).length !== 0 && Object.keys(shortTermTarget).length !== 0
            }
          >
            Set Saving Target
          </Button>
          <SetSavingTargetDialog
            open={openTargetDialog}
            handleClose={() => setOpenTargetDialog(false)}
            canAddShortTerm={Object.keys(shortTermTarget).length === 0}
            canAddLongTerm={Object.keys(longTermTarget).length === 0}
            setFinished={handleSavingTargetCleanup}
          />
        </div>
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
            <MenuItem value="all">All</MenuItem>
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
      <div className={styles.savingTargetContainer}>
        <SavingTargetWidget
          type="shortTerm"
          target={shortTermTarget}
          currentAmount={CWB}
          deleteCallBack={handleSavingTargetCleanup}
        />
        <SavingTargetWidget
          type="longTerm"
          target={longTermTarget}
          currentAmount={CWB}
          deleteCallBack={handleSavingTargetCleanup}
        />
      </div>
      <TransactionTable period={period} getFlag={getFlag} setGetFlag={setGetFlag} />
    </div>
  );
}
