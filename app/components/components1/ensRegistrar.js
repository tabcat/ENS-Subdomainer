import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from '@material-ui/core/InputAdornment';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import HashRegistrar from 'Embark/contracts/HashRegistrar';

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;

// import Contracts from '../contractABI';
//
// const HashRegistrar = Contracts[2];
// const AuctionObj = HashRegistrar.contractObj;
// const AuctionABI = HashRegistrar.abi;


// if (EmbarkJS.isNewWeb3()) {
//   Contracts[contract].contractObj.methods[state.methodName()].apply(null, state.inputs)[tx]()
//     .then((...args) => state.setOutputs(contract, method, args));
// }

// function getEntry(name) {
//   let entry;
//   if (EmbarkJS.isNewWeb3()) {
//     HashRegistrar.methods.entries(sha3(name)).then(_entryentry => entry = _entry)
//   }
//   if (entry) {
//     return entry;
//   }
// }

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


const auction = {
  "time": {
    "total": (86400 * 5), // 5 days
    "reveal": (86400 * 2) // 2 day (48 hours)
  },
  "mode": {
    "0": (props, classes) => [`is available! Start auction below!`, ensOpen(props, classes)],
    "1": (props, classes) => [`auction has been started.`, ensOpen(props, classes)],
    "2": (props, classes) => [`is already owned :(`, ensOwned(props, classes)],
    "3": (props, classes) => [`is forbidden! :o`, ensForb(props, classes)],
    "4": (props, classes) => [`reveal period has started, and the bidding period has closed.`, ensReveal(props, classes)],
    "5": (props, classes) => [`is not yet available`, ensUnavail(props, classes)],
    "6": (props, classes) => [`You Won! One last tx! You need to finalize your name.`, ensFinal(props, classes)]
  }
}


function timeConverter(unixTimestamp){
  var a = new Date(unixTimestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours().length === 1 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes().length === 1 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds().length === 1 ? '0' + a.getSeconds() : a.getSeconds();
  var time = month + ' ' + date + ', ' + year + ' at ' + hour + ':' + min + ':' + sec + ' local time';
  return time;
}

const entryCheck = (props, classes) => {
  if (props.state.entry !== '') {
    return modeCheck(props, classes);
  }
}

const modeCheck = (props, classes) => {
  let name = props.state.nameSearch;
  let entry = props.state.entry;
  let mode = entry["0"];
  let obj = auction.mode[mode](props, classes);
  let title = obj[0];
  let element = obj[1];

  return (
    <div className={classes.marg}>
    <Typography variant="title">{`${name}.eth ${title}`}</Typography>
    {element}
    </div>
  );
}

const ensOpen = (props, classes) => {
  let name = props.state.nameSearch;
  let started = props.state.entry["0"] === "1" ? true : false;
  let revealDate = started ? ` before ${timeConverter(props.state.entry["2"]-auction.time.reveal)}` : "!";
  let labels = [
    `Labelhash: Keccak256 hash of ${props.state.nameSearch} aka labelhash`,
    `Bidder Account: !!must reveal bid using this account!!`,
    "Bid Value (in eth)",
    "Salt: This bit of random info helps hide your bid info :D"
  ];
  return(
    <div>
      <div>
        <Typography variant="subheading">{`Place a bid${revealDate}`}</Typography>

        {props.state.bid.map((param, index) => {
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
            onChange={event => props.state.setBid(event, index)}
            value={props.state.bid[index]}
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
      onClick={event => props.handleDialog(event, true)}
      children={`Send Bid`}
    />
    </div>
  )
}

//Mode, address, uint, uint, uint   state(_hash), h.deed, h.registrationDate, h.value, h.highestBid

const ensOwned = (props, classes) => {
  let entry = props.state.entry;
  let entryLabels = ["Deed Address:", "Registration Date:"];
  return (
    <div>
    <Typography variant="body1">{`${entryLabels[0]} ${entry["1"]}`}</Typography>
    <Typography variant="body1">{`${entryLabels[1]} ${timeConverter(entry["2"])}`}</Typography>
    </div>
  )
}

const ensReveal = (props, classes) => {
  let name = props.state.nameSearch;
  let labels = [
    `Labelhash:`,
    `Bidder Account:`,
    "Bid Value:",
    "Salt:"
  ];
  return(
    <div>
      <div>
        <Typography variant="subheading">{`Reveal your bids! Reveal period ends ${timeConverter(props.state.entry["2"])}.`}</Typography>

        {props.state.bid.map((param, index) => {
          return (<TextField
            key={index}
            className={classes.textField}
            label={labels[index]}
            variant="outlined"
            style={{ margin: 8 }}
            margin="normal"
            fullWidth
            onChange={event => props.state.setBid(event, index)}
            value={props.state.bid[index]}
          />)
        })}
      </div>
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={event => props.revealBid(event)}
      children={`Reveal Bid`}
    />
    </div>
  )
}

const ensForbidden = (props, classes) => {
  return (
    <Typography variant="subheading">{`Not available until ${null}`}</Typography>
  )
}

const ensUnavail = (props, classes) => {
  let availUnixTimestamp;
  HashRegistrar.methods.getAllowedTime(sha3(props.state.nameSearch)).call().then(timestamp => availUnixTimestamp = timestamp);
  let availDate = timeConverter(availUnixTimestamp);
  return (
    <Typography variant="subheading">{`Not available until ${availDate}`}</Typography>
  )
}

const ensFinal = (props, classes) => {
  return(
    <div>
    <Typography variant="subheading">{`Take ownership of ${props.state.nameSearch}.eth`}</Typography>
    <TextField
      key={index}
      className={classes.textField}
      label={labels[index]}
      variant="outlined"
      style={{ margin: 8 }}
      margin="normal"
      fullWidth
      onChange={event => props.state.setBid(event, 0)}
      value={props.state.bid[0]}
    />
    </div>
  )
}



class EnsRegistrar extends React.Component {
  state = {
    nameSearch: "",
    labelhash: () => `0x${sha3(this.state.nameSearch)}`,
    setNameSearch: (event) => this.setState({ nameSearch: namehash.normalize(event.target.value), entry: "", bid: ['','','',''] }),
    entry: "",
    setEntry: (event, nameSearch) => {
      event.persist();
      let uintArr = new Uint32Array(10);
      let salt = `0x${sha3(window.crypto.getRandomValues(uintArr).join(""))}`;
      if(nameSearch.length > 6) {
        HashRegistrar.methods.entries(`0x${sha3(nameSearch)}`).call().then(_entry =>
          this.setState(prevState => ({
            entry: _entry,
            bid: [...prevState.bid.map((input, index) => {
                if (index === 0 && (_entry["0"] === "0" || _entry["0"] === "1")) {
                  return `0x${sha3(prevState.nameSearch)}`;
                } else if (index === 3 && (_entry["0"] === "0" || _entry["0"] === "1")) {
                  return salt;
                }
                return input;
              })]
          }))
        );
      }
    },
    bid: ['','','',''],
    setBid: (event, _index) => {
      event.persist();
      this.setState(prevState => ({
        bid: [...prevState.bid.map((param, index) => (
            _index === index
            ? event.target.value
            : param))]
      }));
    },
    dialogOpen: false,
    currentAcc: ''
  };

  handleSearch(event) {
    if(event.key == 'Enter') {
      this.state.setEntry(event, this.state.nameSearch);
    }
  }

  handleDialog(event, open) {
    event.preventDefault();
    this.setState({dialogOpen: open});
  }

  handleBid(event) {
    event.preventDefault();
    this.handleDialog(event, false);
    let weiArr = this.state.bid.map((value, index) => index === 2 ? web3.utils.toWei(value, "ether") : value)
    if (EmbarkJS.isNewWeb3()) {
      HashRegistrar.methods.shaBid.apply(null, weiArr).call()
      .then(sealedBid => HashRegistrar.methods.startAuctionsAndBid([this.state.labelhash()], sealedBid)
      .send({ from: this.state.currenAcc, value: web3.utils.toWei(this.state.bid[2], "ether") })
      );
    } else {
      console.log(Error('need web3 api v1.00^'));
    }
  }

  revealBid(event) {
    event.preventDefault();

    let value = this.state.bid.map((param, index) => index === 2 ? web3.utils.toWei(param, "ether") : param );
    let reveal = value.filter((param, index) => index !== 1)

    if (EmbarkJS.isNewWeb3()) {
      HashRegistrar.methods.unsealBid.apply(null, reveal).send({ from: this.state.currenAcc });
    } else {
      console.log(Error('need web3 api v1.00^'));
    }
  }

  handleFinalize(event) {
    event.preventDefault();
		
		let { labelhash, currentAcc } = this.state;
    HashRegistrar.methods.finalize(labelhash()).send({ from: currentAcc });
  }

  checkAcc(obj) {
    if(!(this.state.currentAcc === obj.selectedAddress)) {
      this.setState({currentAcc: obj.selectedAddress});
    }
  }

  componentDidMount() {
    this.setState({currentAcc: web3.eth.defaultAccount});
    web3.currentProvider.publicConfigStore.on('update', obj => this.checkAcc(obj));
  }

  componentWillUnmount() {
    web3.currentProvider.publicConfigStore.removeAllListeners();
  }

  // label={input.type}
  // helperText={input.name}

  render() {
    const { classes, fullScreen } = this.props;

    const dialog = (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.dialogOpen}
          onClose={event => this.handleDialog(event,false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Before you send your bid..."}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Make sure to copy or screenshot your bid info so you can reveal your bid!!
              <br />
              <br />
              Bid:<br />
                labelhash: {this.state.bid[0]}<br />
                account: {this.state.bid[1]}<br />
                bid value: {this.state.bid[2]}<br />
                salt: {this.state.bid[3]}

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={event => this.handleDialog(event, false)} color="primary">
              Cancel
            </Button>
            <Button onClick={event => this.handleBid(event)} color="primary" autoFocus>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )

    return (
      <div className={classes.root}>
        <div className={classes.spacer}/>
        <div>
      <Typography variant="title" children={`Ethereum Name Service Registrar`}/>
      <Typography variant="subheading" children={`buy TLDs on ENS!`}/>
      <div className={classes.spacer}/>
      <TextField
        className={classes.textField}
        helperText={this.state.nameSearch.length > 6 ? `Press enter` : `name must be  >=7 characters`}
        variant="outlined"
        style={{ margin: 8 }}
        margin="normal"
        fullWidth
        onChange={event => this.state.setNameSearch(event)}
        onKeyDown={event => this.handleSearch(event)}
        value={this.state.nameSearch}
        InputProps={{
            endAdornment: <InputAdornment position="end">.eth</InputAdornment>,
          }}
        />
        <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={!(this.state.nameSearch.length > 6)}
          onClick={event => this.state.setEntry(event, this.state.nameSearch)}
          children={`Search`}
        />
      </div>
      </div>
        <div>
          {entryCheck(this, classes)}
        </div>
        <div className={classes.toolbar}/>
        {dialog}
      </div>
    );
  }
}

EnsRegistrar.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(withStyles(styles, )(EnsRegistrar));
