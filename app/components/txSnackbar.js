import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import store from '../store';

const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'error']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class TxSnackbar extends React.Component {

  snackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    // this.setState({ snack: false });
    store.dispatch({
      type: 'CLOSE_SNACK'
    });
  };

  render() {
    const { classes, snackOpen, tx, error, networkType } = this.props;

    const wrapped = () => {
      let variant;
      let message;
      let txExplorer;

      switch (networkType) {
        case 'private':
          txExplorer = `http://localhost:8000/embark/explorer/transactions/`;
          break;
        case 'ropsten':
          txExplorer = `https://ropsten.etherscan.io/tx/`;
          break;
        case 'main':
          txExplorer = `https://etherscan.io/tx/`;
          break;
        default:
          txExplorer = `//unrecognized networkType`
      }

      if (error === null && typeof tx === 'string'){
        variant = 'success';
        message = (
          <div>
            Tx Sent:
            <a href={ txExplorer + tx} target='_blank'>
              {txExplorer.split('//')[1] + tx.slice(0, 8) + '...'}
            </a>
          </div>
        );
      } else {
        variant = 'error';
        message = (
          <div>
            Error: {error}
          </div>
        );
      }
      return (
        <MySnackbarContentWrapper
          onClose={this.onClose}
          variant={variant}
          message={message}
        />
      )
    }

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackOpen}
          autoHideDuration={6000}
          onClose={this.snackClose}
        >
          {wrapped()}
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  let { snackOpen, tx, error } = store.txSnackbarState;
  return {
    snackOpen,
    tx,
    error,
    nameSearch: store.ensRegistrarState.nameSearch,
    bid: store.ensRegistrarState.bid,
    currentAcc: store.web3State.currentAcc,
    networkType: store.web3State.networkType
  };
}

TxSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles2)(TxSnackbar));
