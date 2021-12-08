import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import swal from 'sweetalert2';
import { setSavingTarget } from '../Services/savingTargetService';

export default function SetSavingTargetDialog(props) {
  const { open, handleClose, canAddShortTerm, canAddLongTerm, setFinished } = props;
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [type, setType] = useState();
  const [targetAmount, setTargetAmount] = useState();

  const handleSubmit = () => {
    const token = JSON.parse(sessionStorage.getItem('MoneyPlusPlusToken'));
    setSavingTarget(token, type, date, targetAmount)
      .then(() => {
        setFinished(type);
        setDate(moment().format('YYYY-MM-DD'));
        setType();
        setTargetAmount();
      })
      .catch(() => {
        swal.fire('oops. Something went wrong. Please try again later');
        setDate(moment().format('YYYY-MM-DD'));
        setType();
        setTargetAmount();
      });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setType();
        setTargetAmount();
        handleClose();
      }}
    >
      <DialogTitle id="form-dialog-title">Set your saving target</DialogTitle>
      <DialogContent>
        <DialogContentText>Please set your saving target below.</DialogContentText>
        <TextField
          select
          label="Saving Target Type"
          fullWidth
          onChange={(e) => setType(e.target.value)}
        >
          {canAddShortTerm && (
            <MenuItem key="shortTerm" value="shortTerm">
              Short Term
            </MenuItem>
          )}
          {canAddLongTerm && (
            <MenuItem key="longTerm" value="longTerm">
              Long Term
            </MenuItem>
          )}
        </TextField>
        <TextField
          margin="dense"
          id="target"
          label="Target ($)"
          type="number"
          fullWidth
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
        <TextField
          id="endDate"
          label="Saving End Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          inputProps={{
            min: moment().format('YYYY-MM-DD'),
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setType();
            setTargetAmount();
            handleClose();
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={!type || !targetAmount}>
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}
