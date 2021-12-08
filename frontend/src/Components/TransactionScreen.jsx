import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import moment from 'moment';
import DatePicker from './DatePicker';
import tranService from '../Services/TransactionService';
import styles from '../Styles/TransactionScreen.module.css';

const transactionTypes = [
  {
    value: 'income',
    label: 'Income',
  },
  {
    value: 'expense',
    label: 'Expense',
  },
];

const expenseList = [
  {
    value: 'food',
    label: 'Food',
  },
  {
    value: 'shopping',
    label: 'Shopping',
  },
  {
    value: 'entertainment',
    label: 'Entertainment',
  },
  {
    value: 'transport',
    label: 'Transport',
  },
  {
    value: 'bills',
    label: 'Bills & Fees',
  },
  {
    value: 'travel',
    label: 'Travel',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const incomeList = [
  {
    value: 'salary',
    label: 'Salary',
  },
  {
    value: 'business',
    label: 'Business',
  },
  {
    value: 'gifts',
    label: 'Gifts',
  },
  {
    value: 'extra',
    label: 'Extra Income',
  },
  {
    value: 'loan',
    label: 'Loan',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export default function FormDialog(props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState('other');
  const [addDisabled, setAddDisabled] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [errorDate, setErrorDate] = useState(true);
  const [descriptions, setDescriptions] = useState('');
  const { setGetFlag } = props;

  useEffect(() => {
    if (date !== '' && new Date(date) > new Date('1970-01-01') && moment(date) <= moment()) {
      setErrorDate(false);
    } else {
      setErrorDate(true);
    }
  }, [date]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCategoriesChange = (event) => {
    setCategories(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setType('expense');
    setAmount('');
    setCategories('other');
    setDate(moment().format('YYYY-MM-DD'));
    setDescriptions('');
    setAddDisabled(true);
    setErrorStatus(false);
    setErrorText('');
    setOpen(false);
  };

  const handleAdd = () => {
    tranService({
      date: new Date(date),
      type,
      category: categories,
      amount: Number(amount),
      description: descriptions,
    });
    handleClose();
    setGetFlag(true);
  };

  const validateAmount = (value) => {
    let validCheck = true;
    setAmount(value);
    if (value === '') {
      validCheck = false;
      setErrorText('Please enter amount');
    }
    if (value.length > 9) {
      validCheck = false;
      setErrorText('Exceed maximum length');
    }
    if (value <= 0) {
      validCheck = false;
      setErrorText('Have to be a positive integer');
    }
    if (!value.match(/^(?!(?:0|0\.0|0\.00)$)[+]?\d+(\.\d|\.\d[0-9])?$/)) {
      validCheck = false;
      setErrorText('Have to be in money format');
    }
    if (validCheck) {
      setAddDisabled(false);
      setErrorStatus(false);
      setErrorText('');
    } else {
      setAddDisabled(true);
      setErrorStatus(true);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="default"
        onClick={handleClickOpen}
        startIcon={<AddCircleIcon />}
      >
        Add Transaction
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add your transaction by entering the amount, date and category.
          </DialogContentText>
          <div className={styles.inputContainer}>
            <TextField id="type" select label="Type" value={type} onChange={handleTypeChange}>
              {transactionTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <DatePicker date={date} setDate={setDate} errorDate={errorDate} />
            <TextField
              error={errorStatus}
              id="amount"
              label="Amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => validateAmount(e.target.value)}
              helperText={errorText}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className={styles.categories}>
            {type === 'expense' ? (
              <TextField
                id="category"
                select
                label="Category"
                value={categories}
                onChange={handleCategoriesChange}
                fullWidth
              >
                {expenseList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                id="category"
                select
                label="Category"
                value={categories}
                onChange={handleCategoriesChange}
                fullWidth
              >
                {incomeList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </div>
          <div className={styles.details}>
            <TextField
              id="outlined-multiline-static"
              label="Write a note"
              value={descriptions}
              onChange={(e) => setDescriptions(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary" disabled={addDisabled || errorDate}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
