import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import moment from 'moment';
import swal from 'sweetalert2';
import { deleteSavingTarget } from '../Services/savingTargetService';

const useStyles = makeStyles({
  cardRoot: {
    minWidth: 500,
  },
  button: {
    marginBottom: '2%',
  },
});

export default function SavingTargetWidget(props) {
  const { type, target, currentAmount, deleteCallBack } = props;
  const typeString = type === 'longTerm' ? 'Long-Term' : 'Short-Term';

  const handleDelete = () => {
    deleteSavingTarget(JSON.parse(sessionStorage.getItem('MoneyPlusPlusToken')), type)
      .then(() => {
        deleteCallBack(type);
      })
      .catch(() => {
        swal.fire('oops. Something went wrong. Please try again later');
      });
  };

  let targetProgressDescription;
  if (target) {
    if (currentAmount < target.targetNumber) {
      if (moment() > moment(target.endDate)) {
        targetProgressDescription = 'The day has passed and you have not reached your goal';
      } else {
        targetProgressDescription = 'Keep saving!';
      }
    } else {
      targetProgressDescription = 'Hooray, you have reached your saving goal';
    }
  }
  const classes = useStyles();
  return (
    <Card className={classes.cardRoot}>
      <CardContent>
        <Typography variant="h6">{typeString} Saving Target</Typography>
        {Object.keys(target).length !== 0 ? (
          <>
            <Typography color="textSecondary" variant="h6">
              Your current progress:
            </Typography>
            <Typography color="textSecondary" variant="h6">
              {currentAmount}/{target.targetNumber}
            </Typography>
            <Typography color="textSecondary" variant="h6">
              Until {moment(target.endDate).format('MMMM Do YYYY')}
            </Typography>
            <Typography color="textSecondary" variant="h6">
              {targetProgressDescription}
            </Typography>
          </>
        ) : (
          <Typography color="textSecondary">
            You do not have any {typeString} saving target yet
          </Typography>
        )}
      </CardContent>
      {Object.keys(target).length !== 0 && (
        <Button
          className={classes.button}
          variant="contained"
          color="default"
          onClick={handleDelete}
        >
          Clear Target
        </Button>
      )}
    </Card>
  );
}
