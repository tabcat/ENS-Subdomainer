import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { connect } from 'react-redux';
import store from '../store';

import EmbarkJS from 'Embark/EmbarkJS';
import HashRegistrar from 'Embark/contracts/HashRegistrar';
import SubdomainRegistrar from 'Embark/contracts/SubdomainRegistrar';

const sha3 = require('js-sha3').keccak_256;
const labelhash = (label) => `0x${sha3(label)}`;

const styles = theme => ({
  root: {
    display: "flex",
  }
});

const bidActions = (comp) =>
(
  <DialogActions>
    <Button onClick={event => comp.handleDialog(event, false)} color="primary">
      Cancel
    </Button>
    <Button onClick={event => comp.handleBid(event)} color="primary" autoFocus>
      Send
    </Button>
  </DialogActions>
);


const bidContent = (bid) => {
  let labels = ['labelhash', 'account', 'bid value', 'salt'];
  let bidInfo = bid.map((input, index) => <DialogContentText key={index} children={`${labels[index]}: ${input}`} />);
  return (
    <DialogContent>
      <DialogContentText>
        Make sure to copy your bid info so you can reveal your bid!!
      </DialogContentText>
      {bidInfo}
    </DialogContent>
  )
}

const subnameActions = (comp) =>
(
  <DialogActions>
    <Button onClick={event => comp.handleDialog(event, false)} color="primary">
      Cancel
    </Button>
    <Button onClick={event => comp.registerSub(event)} color="primary" autoFocus>
      Send
    </Button>
  </DialogActions>
);

const enableEthActions = (comp) =>
(
  <DialogActions>
    <Button onClick={event => comp.handleDialog(event, false)} color="primary">
      Cancel
    </Button>
    <Button onClick={event => comp.enableEth(event)} color="primary" autoFocus>
      Authorize
    </Button>
  </DialogActions>
);

const enableEthContent =
(
  <DialogContent>
    <DialogContentText>
      if you dont, this site will not be able to interact with ethereum :(
    </DialogContentText>
  </DialogContent>
)


const optionsCheck = (comp) => {
  let { fullScreen, dialogOpen, dialogAction, bid, subnameSearch, rootDomain } = comp.props;
  let options;
  switch(dialogAction) {
    case 'ENS_BID':
      options = {
        title: 'BEFORE YOU BID!!!',
        content: bidContent(bid),
        actions: bidActions(comp)
      };
      break;
    case 'SUBNAME_REGI':
      options = {
        title: `Are you sure you want to register ${subnameSearch}.${rootDomain}.eth for 0.002eth ?`,
        content: "",
        actions: subnameActions(comp)
      };
      break;
    case 'ENABLE_ETH':
      options = {
        title: `Please authorize your web3 provider to inject web3.`,
        content: enableEthContent,
        actions: enableEthActions(comp)
      };
      break;
    default:
      options = {
        title: '',
        content: '',
        actions: ''
      }
  }
  let { title, content, actions } = options;
  return (
      <Dialog
        fullScreen={fullScreen}
        open={dialogOpen || false}
        onClose={event => comp.handleDialog(event,false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        {content}
        {actions}
      </Dialog>
  )
}


class Dialogger extends React.Component {

  handleDialog(event, open) {
    event.preventDefault();
    // this.setState({dialogOpen: open});
    store.dispatch({
      type: 'TOGGLE_DIALOG',
      dialogOpen: open
    })
  }

  handleBid(event) {
    event.preventDefault();
    this.handleDialog(event, false);
    let { nameSearch, bid, currentAcc } = this.props;
    let labelhashed = labelhash(nameSearch);
    let weiArr = bid.map((value, index) => index === 2 ? web3.utils.toWei(value, "ether") : value)
    if (EmbarkJS.isNewWeb3()) {
      HashRegistrar.methods.shaBid.apply(null, weiArr).call()
      .then(sealedBid => HashRegistrar.methods.startAuctionsAndBid([labelhashed], sealedBid)
      .send({ from: currentAcc, value: web3.utils.toWei(bid[2], "ether") })
      .on("transactionHash", (hash) => this.handleTxHash(null, hash))
      .on("error", (err) => this.handleTxHash(err, undefined))
      );
    } else {
      console.log(Error('need web3 api v1.00^'));
    }
  }

  // handleRegister(event) {
  //   event.preventDefault();
  //   this.handleDialog(event, false);
  //   SubdomainRegistrar.
  // }

  registerSub(event) {
    event.preventDefault()
    let { rootDomain, subnameSearch, referralAddr, resolverAddr, currentAcc } = this.props;

    // bytes32 label, string subdomain, address subdomainOwner, address referrer, address resolver
    let inputs = [`0x${sha3(rootDomain)}`, subnameSearch, currentAcc, referralAddr, resolverAddr];

    if (EmbarkJS.isNewWeb3()) {
      SubdomainRegistrar.methods.register.apply(null, inputs).send({ from: currentAcc, value: "2000000000000000" })
      .on("transactionHash", (hash) => this.handleTxHash(null, hash))
      .on("error", (err) => this.handleTxHash(err, undefined));
      // this.setState({ dialogOpen: false });
      store.dispatch({
        type: 'TOGGLE_DIALOG',
        dialog: false
      })
    } else {
      console.log(Error("requires web3 api v1 or higher"))
    }
  }

  handleTxHash(err, txHash) {
    let tx = txHash;
    let error = err === null ? null : err.message.split(`Error:`)[err.message.split(`Error:`).length -1];
    // this.setState({
    //   snack: true,
    //   tx: txState
    // });
    store.dispatch({
      type: 'TX_SNACK',
      snackOpen: true,
      tx,
      error
    })
  }

  enableEth(event) {
    event.preventDefault();
    ethereum.enable()
    .then(() => {
      store.dispatch({
        type: 'WEB3_ENABLED'
      })
    })
    .catch();
  }

  render() {
    const { classes, fullScreen } = this.props;

    return (
      <div className={classes.root}>
        {optionsCheck(this)}
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  let { dialogOpen, dialogAction } = store.dialoggerState;
  let { rootDomain, referralAddr, resolverAddr } = store.appConfigState;
  return {
    dialogOpen,
    dialogAction,
    nameSearch: store.ensRegistrarState.nameSearch,
    subnameSearch: store.subnameState.subnameSearch,
    rootDomain,
    referralAddr,
    resolverAddr,
    bid: store.ensRegistrarState.bid,
    currentAcc: store.web3State.currentAcc
  };
}

Dialogger.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(withMobileDialog()(withStyles(styles)(Dialogger)));
