import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function DatePickers(props) {
  const classes = useStyles();

  const { date, setDate, errorDate } = props;

  const handleChangeOnDate = (event) => {
    setDate(event.target.value);
  };

  const inputProps = {
    max: moment().format('YYYY-MM-DD'),
    min: moment.min('1970-01-01'),
  };

  return (
    <form className={classes.container} noValidate>
      <TextField
        error={errorDate}
        id="date"
        label="Time"
        type="date"
        value={date}
        helperText={errorDate && 'Please select a date between 1970-01-01 and today'}
        onChange={handleChangeOnDate}
        inputProps={inputProps}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
}
