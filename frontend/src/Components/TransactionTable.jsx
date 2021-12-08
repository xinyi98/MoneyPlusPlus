import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import moment from 'moment';
import swal from 'sweetalert2';
import { getTransactionsWithinPeriod, deleteTransaction } from '../Services/queryListService';

const columns = [
  {
    id: 'date',
    label: 'Date',
    align: 'center',
    minWidth: 140,
    format: (value) => moment(value).format('YYYY-MM-DD'),
  },
  { id: 'type', label: 'Type', align: 'center', minWidth: 100 },
  { id: 'category', label: 'Category', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 200 },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  { id: 'action', label: 'Action', align: 'center', minWidth: 100 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 650,
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tranItems, setTranItems] = React.useState([]);
  const [detailId, setId] = React.useState('');
  const [deleteFlag, setDeleteFlag] = React.useState(false);
  const { period, getFlag, setGetFlag } = props;

  useEffect(() => {
    const userToken = JSON.parse(sessionStorage.getItem('MoneyPlusPlusToken'));
    getTransactionsWithinPeriod(period, userToken).then((res) => {
      const { detailList = [] } = res.data;
      setTranItems(detailList);
    });
    setGetFlag(false);
    setDeleteFlag(false);
  }, [period, getFlag, deleteFlag]);

  const handleClickOpen = (value) => {
    setId(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const userToken = JSON.parse(sessionStorage.getItem('MoneyPlusPlusToken'));
    setDeleteFlag(true);
    deleteTransaction(detailId, userToken)
      .then(() => {
        swal.fire('The transaction is deleted');
      })
      .catch(() => {
        swal.fire('Something went wrong, please try again later :(');
      });
    setGetFlag(true);
    handleClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tranItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === 'action') {
                    return (
                      <TableCell key={row.id} style={{ textAlign: 'center' }}>
                        <Button
                          id={row.id}
                          variant="contained"
                          color="secondary"
                          onClick={() => handleClickOpen(row.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tranItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Alert</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you want to delete this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
