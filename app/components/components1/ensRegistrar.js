import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from '@material-ui/core/InputAdornment';

import { connect } from 'react-redux';
import store from '../../store';

import EmbarkJS from 'Embark/EmbarkJS';
import ENSRegistry from 'Embark/contracts/ENSRegistry';
import HashRegistrar from 'Embark/contracts/HashRegistrar';
const Contract = (abi, addr) => new web3.eth.Contract(abi, addr);
import DeedABI from './DeedABI';

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;
const labelhash = (label) => `0x${sha3(label)}`;

const styles = theme => ({
  root: {
    flexWrap: "wrap"
  },
  flex: {
    flexWrap: "wrap",
    display: "flex"
  },
  textField: {
    flexWrap: "wrap",
    [theme.breakpoints.up("sm")]: {
      width: `450`
    }
  },
  marg: {
    margin: theme.spacing.unit
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  toolbar: theme.mixins.toolbar,
  spacer: {
    marginBottom: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit,
  }
});


// auction.time set to test contracts auction length
// live auction contract time is:
// "total": (86400 * 5), // 5 days
// "reveal": (86400 * 2) // 2 day (48 hours)
// let networkType;

// const auction = {
//   "time": {
//     "total": (5 * (networkType === "private" ? 60 : 86400)), // 5 min
//     "reveal": (2 * (networkType === "private" ? 60 : 86400)) // 2 min
//   },
//   "mode": {
//     "0": (props) => ensOpen(props),
//     "1": (props) => ensOpen(props),
//     "2": (props) => ensOwned(props),
//     "3": (props) => ensForb(props),
//     "4": (props) => ensReveal(props),
//     "5": (props) => ensUnavail(props),
//     "6": (props) => ensFinal(props)
//   }
// }

function timeConverter(unixTimestamp){
  var a = new Date(unixTimestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = `${a.getHours()}`.length === 1 ? '0' + a.getHours() : a.getHours();
  var min = `${a.getMinutes()}`.length === 1 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = `${a.getSeconds()}`.length === 1 ? '0' + a.getSeconds() : a.getSeconds();
  // var time = date + ' of ' + month + ' ' + year + ' at ' + hour + ':' + min + ':' + sec + ' local time';
  var time = `${date} of ${month}, ${year} at ${hour}:${min} local time`;
  return time;
}

const entryCheck = (comp) => {
  let { entry, entryState } = comp.props;
  if (entry !== "" && entryState !== "") {
    return modeCheck(comp);
  }
}

const modeCheck = (comp) => {
  let { classes, entryState } = comp.props;
  let mode = entryState;
  let element = comp.auction.mode[mode](comp);

  return (
    <div>
      {element}
    </div>
  );
}

const ensOpen = (comp) => {
  let { classes, nameSearch, entry, bid } = comp.props;
  let started = entry["0"] === "1" ? true : false;
  let revealDate = started ? ` before ${timeConverter(entry["2"]-comp.auction.time.reveal)}` : "!";
  let labels = [
    `Labelhash: Keccak256 hash of ${nameSearch}`,
    `Bidder Account: !!must reveal bid using this account!!`,
    "Bid Value (in eth)",
    "Salt: This bit of random info helps hide your bid info :D"
  ];
  return(
    <div>
      <Typography variant="title">{`${nameSearch}.eth is available!`}</Typography>
      <div>
        <Typography variant="subheading">{`Place a bid${revealDate}`}</Typography>

        {Object.keys(bid).map((param, index) => {
          let read = index === 0 || index === 3 ? true : false;
          return (<TextField
            key={index}
            className={classes.textField}
            label={read ? "read only" : false}
            helperText={labels[index]}
            variant="outlined"
            style={{ margin: 8}}
            margin="normal"
            fullWidth
            onChange={event => comp.setBid(event, index)}
            value={bid[index]}
            InputProps={{
              readOnly: read,
            }}
          />)
        })}
      </div>
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={event => comp.bidDialog(event)}
      children={`Send Bid`}
    />
    </div>
  )
}

const ensOwned = (comp) => {
  let { classes, nameSearch, entry } = comp.props;
  let entryLabels = ["Deed Address:", "Registration Date:"];
  return (
    <div>
      <Typography variant="title">{`${nameSearch}.eth is already owned :(`}</Typography>
      <div>
        <Typography variant="body1">{`${entryLabels[0]} ${entry["1"]}`}</Typography>
        <Typography variant="body1">{`${entryLabels[1]} ${timeConverter(entry["2"])}`}</Typography>
      </div>
    </div>
  )
}

const ensReveal = (comp) => {
  let { classes, nameSearch, entry, bid } = comp.props;
  let labels = [
    `Labelhash:`,
    `Bidder Account:`,
    "Bid Value:",
    "Salt:"
  ];
  return(
    <div>
      <Typography variant="title">{`The reveal period for ${nameSearch}.eth has started, the bidding period has closed.`}</Typography>
      <div>
        <Typography variant="subheading">{`Reveal your bids! Reveal period ends ${timeConverter(entry["2"])}.`}</Typography>

        {bid.map((param, index) => {
          let read = index === 0 ? true : false;
          return (<TextField
            key={index}
            className={classes.textField}
            label={labels[index]}
            variant="outlined"
            style={{ margin: 8 }}
            margin="normal"
            fullWidth
            onChange={event => comp.setBid(event, index)}
            value={bid[index]}
            InputProps={{
              readOnly: read,
            }}
          />)
        })}
      </div>
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={event => comp.revealBid(event)}
      children={`Reveal Bid`}
    />
    </div>
  )
}

const ensForbidden = (comp) => {
  let { classes, nameSearch } = comp.props;
  return (
    <div>
      <Typography variant="title">{`${nameSearch}.eth is forbidden! :o`}</Typography>
      <div>
        <Typography variant="subheading">{`The state method cant even return this mode atm... lol`}</Typography>
      </div>
    </div>
  )
}

const ensUnavail = (comp) => {
  let { classes, nameSearch } = comp.props;
  let availUnixTimestamp;
  HashRegistrar.methods.getAllowedTime(sha3(nameSearch)).call().then(timestamp => availUnixTimestamp = timestamp);
  let availDate = timeConverter(availUnixTimestamp);
  return (
    <div>
      <Typography variant="title">{`${nameSearch}.eth is not yet available`}</Typography>
      <div>
        <Typography variant="subheading">{`Try again later (names are made available "randomly")`}</Typography>
      </div>
    </div>
  )
}

const ensFinal = (comp) => {
  let { classes, nameSearch, deedOwner, bid, currentAcc } = comp.props;
  let isOwner = currentAcc === web3.utils.toHex(deedOwner) ? true : false;
  let title = isOwner ? `Finalize your purchase` : `${nameSearch}.eth is already owned`;
  let sub = isOwner ? `Take ownership of ${nameSearch}.eth` : `Account needed to finalize auction: ${deedOwner}`;

  return(
    <div>
      <Typography variant="title">{title}</Typography>
      <div>
        <Typography variant="subheading">{sub}</Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={!(isOwner)}
          onClick={event => comp.handleFinalize(event)}
          children={`Finalize`}
        />
      </div>
    </div>
  )
}

class EnsRegistrar extends React.Component {

    auction = {
      "time": {
        "total": (5 * (this.props.networkType === "private" ? 60 : 86400)), // 5 min
        "reveal": (2 * (this.props.networkType === "private" ? 60 : 86400)) // 2 min
      },
      "mode": {
        "0": (comp) => ensOpen(comp),
        "1": (comp) => ensOpen(comp),
        "2": (comp) => ensOwned(comp),
        "3": (comp) => ensForb(comp),
        "4": (comp) => ensReveal(comp),
        "5": (comp) => ensUnavail(comp),
        "6": (comp) => ensFinal(comp)
      }
    }

      setNameSearch(event) {
        // this.setState({ nameSearch: namehash.normalize(event.target.value), entry: "", entryState: "", bid: ['','','',''] });
        store.dispatch({
          type: 'SET_NAME_SEARCH',
          nameSearch: namehash.normalize(event.target.value)
        });
      }

      async setEntry(event) {
        event.persist();
        let { nameSearch, bid } = this.props;
        if(nameSearch.length > 6) {
          let uintArr = new Uint32Array(10);
          let salt = labelhash(window.crypto.getRandomValues(uintArr).join(""));
          let entry = await HashRegistrar.methods.entries(labelhash(nameSearch)).call();

          let deedAddr = entry["1"];
          let deedOwner;
          let ensOwner;

          if (deedAddr !== "0x0000000000000000000000000000000000000000") {
          deedOwner = await Contract(DeedABI, deedAddr).methods.owner().call();
          ensOwner = await ENSRegistry.methods.owner(namehash.hash(`${nameSearch}.eth`)).call();
          }

          let entryState = entry["0"];

          if (entryState === "4") {
            salt = "";
          }

          if (entryState === "2" && (deedOwner !== ensOwner && ensOwner === "0x0000000000000000000000000000000000000000")) {
            entryState = "6";
          }
          // this.setState(prevState => ({
          //   entry: _entry,
          //   entryState: _entryState,
          //   deedOwner: _deedOwner,
          //   bid: [...prevState.bid.map((input, index) => {
          //       if (index === 0 && ((_entry["0"] === "0" || _entry["0"] === "1") || _entry["0"] === "4")) {
          //         return `0x${sha3(prevState.nameSearch)}`;
          //       } else if (index === 3 && (_entry["0"] === "0" || _entry["0"] === "1")) {
          //         return salt;
          //       }
          //       return "";
          //     })]
          // }));
          let newBid = bid.map((input, index) => {
                if (index === 0 && ((entry["0"] === "0" || entry["0"] === "1") || entry["0"] === "4")) {
                  return `0x${sha3(nameSearch)}`;
                } else if (index === 3 && (entry["0"] === "0" || entry["0"] === "1")) {
                  return salt;
                }
                return "";
              })
          store.dispatch({
            type: 'SET_ENTRY',
            entry,
            entryState,
            deedOwner,
            bid: newBid
          });

        }
      }

      setBid(event, _index) {
        event.persist();
        let { bid } = this.props;
        let newBid = bid.map((param, index) => _index === index ? event.target.value : param);
        // this.setState(prevState => ({
        //   bid: [...prevState.bid.map((param, index) => (
        //       _index === index
        //       ? event.target.value
        //       : param))]
        // }));
        store.dispatch({
          type: 'SET_BID',
          bid: newBid
        });
      }

      handleSearch(event) {
        if(event.key == 'Enter') {
          this.setEntry(event);
        }
      }

      bidDialog(event) {
        event.preventDefault();
        // this.setState({dialogOpen: open});
        store.dispatch({
          type: 'SET_DIALOG',
          dialogOpen: true,
          dialogAction: 'ENS_BID'
        })
      }

      // handleBid(event) {
      //   event.preventDefault();
      //   this.handleDialog(event, false);
      //   let { nameSearch } = this.props;
      //   let labelhashed = labelhash(nameSearch);
      //   let weiArr = this.props.bid.map((value, index) => index === 2 ? web3.utils.toWei(value, "ether") : value)
      //   if (EmbarkJS.isNewWeb3()) {
      //     HashRegistrar.methods.shaBid.apply(null, weiArr).call()
      //     .then(sealedBid => HashRegistrar.methods.startAuctionsAndBid([labelhashed], sealedBid)
      //     .send({ from: this.props.currentAcc, value: web3.utils.toWei(this.state.bid[2], "ether") })
      //     .on("transactionHash", (hash) => this.handleTxHash(null, hash))
      //     .on("error", (err) => this.handleTxHash(err, undefined))
      //     );
      //   } else {
      //     console.log(Error('need web3 api v1.00^'));
      //   }
      // }

      revealBid(event) {
        event.preventDefault();

        let value = this.props.bid.map((param, index) => index === 2 ? web3.utils.toWei(param, "ether") : param );
        let reveal = value.filter((param, index) => index !== 1)

        if (EmbarkJS.isNewWeb3()) {
          HashRegistrar.methods.unsealBid.apply(null, reveal).send({ from: this.props.currentAcc })
          .on("transactionHash", (hash) => this.handleTxHash(null, hash))
          .on("error", (err) => this.handleTxHash(err, undefined));
        } else {
          console.log(Error('need web3 api v1.00^'));
        }
      }

      handleFinalize(event) {
        event.preventDefault();
    		let { nameSearch, currentAcc } = this.props;
        let labelhashed = labelhash(nameSearch);
        HashRegistrar.methods.finalizeAuction(labelhashed).send({ from: currentAcc })
        .on("transactionHash", (hash) => this.handleTxHash(null, hash))
        .on("error", (err) => this.handleTxHash(err, undefined));
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

      // handleTxHash(err, txHash) {
      //   let tx;
      //   if (err === null && typeof txHash === "string") {
      //     tx = txHash;
      //   } else {
      //     tx = {
      //       variant: "error",
      //       message: (
      //         <div>
      //           Error: {_err.message}
      //         </div>
      //       )
      //     }
      //   }
      //   // this.setState({
      //   //   snack: true,
      //   //   tx: txState
      //   // });
      //   store.dispatch({
      //     type: 'TX_SNACK',
      //     snack: true,
      //     tx
      //   })
      // }

      // snackClose = (event, reason) => {
      //   if (reason === 'clickaway') {
      //     return;
      //   }
      //   // this.setState({ snack: false });
      //   store.dispatch({
      //     type: 'CLOSE_SNACK'
      //   })
      // };

      // checkAcc(obj) {
      //   if(!(this.state.currentAcc === obj.selectedAddress)) {
      //     this.setState({currentAcc: obj.selectedAddress});
      //   }
      // }

      // componentDidMount() {
      //   try {
      //     if(web3.currentProvider !== null) {
      //       EmbarkJS.onReady(() => {
      //         if (EmbarkJS.isNewWeb3()) {
      //
      //
      //           web3.eth.net.getNetworkType((err, type) => networkType = type);
      //
      //         } else {
      //           if (EmbarkJS.Messages.providerName === 'whisper') {
      //             console.log(Error(`current web3 api not supported`))
      //           } else {
      //             console.log(Error(`web3 provider not detected/mounted`))
      //           }
      //         }
      //       });
      //     } else {
      //       console.log(Error(`web3 provider not detected/mounted`))
      //     }
      //   }
      //   catch(err) {
      //     console.log(err);
      //   }
      // }
  //
  //     componentWillUnmount() {
  //       try {
  //         if (web3.currentProvider !== null){
  //
  //           web3.currentProvider.publicConfigStore.removeAllListeners();
  //
  //         }
  //       }
  //       catch(err) {
  //         console.log(err);
  //       }
  //     }
  // // label={input.type}
  // // helperText={input.name}

  render() {
    const { classes, nameSearch } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.spacer}/>
        <div>
      <Typography variant="title" children={`Ethereum Name Service Registrar`}/>
      <Typography variant="subheading" children={`buy TLDs on ENS!`}/>
      <div className={classes.spacer}/>
      <TextField
        className={classes.textField}
        helperText={nameSearch.length > 6 ? `Press enter` : `name must be  >=7 characters`}
        variant="outlined"
        style={{ margin: 8 }}
        margin="normal"
        fullWidth
        onChange={event => this.setNameSearch(event)}
        onKeyDown={event => this.handleSearch(event)}
        value={nameSearch}
        InputProps={{
            endAdornment: <InputAdornment position="end">.eth</InputAdornment>,
          }}
        />
        <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={!(nameSearch.length > 6)}
          onClick={event => this.setEntry(event, nameSearch)}
          children={`Search`}
        />
      </div>
      </div>
        <div>
          {entryCheck(this)}
        </div>
        <div className={classes.toolbar}/>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  let { nameSearch, entry, entryState, bid, snack, tx, deedOwner } = store.ensRegistrarState;
  return {
    nameSearch,
    entry,
    entryState,
    bid,
    snack,
    tx,
    deedOwner,
    currentAcc: store.web3State.currentAcc,
    networkType: store.web3State.networkType
  };
}

EnsRegistrar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(EnsRegistrar));
