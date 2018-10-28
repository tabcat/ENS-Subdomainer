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

import ENSRegistry from 'Embark/contracts/ENSRegistry';
import HashRegistrar from 'Embark/contracts/HashRegistrar';
const Contract = (abi, addr) => new web3.eth.Contract(abi, addr);
import DeedABI from './DeedABI';

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;
const labelhash = (label) => `0x${sha3(label)}`

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
let networkType;

const auction = {
  "time": {
    "total": (5 * (networkType === "private" ? 60 : 86400)), // 5 min
    "reveal": (2 * (networkType === "private" ? 60 : 86400)) // 2 min
  },
  "mode": {
    "0": (props) => ensOpen(props),
    "1": (props) => ensOpen(props),
    "2": (props) => ensOwned(props),
    "3": (props) => ensForb(props),
    "4": (props) => ensReveal(props),
    "5": (props) => ensUnavail(props),
    "6": (props) => ensFinal(props)
  }
}

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

const entryCheck = (props) => {
  let { entry, entryState } = props.state;
  if (entry !== "" && entryState !== "") {
    return modeCheck(props);
  }
}

const modeCheck = (props) => {
  let { entryState } = props.state;
  let { classes } = props.props;
  let mode = entryState;
  let element = auction.mode[mode](props);

  return (
    <div>
    {element}
    </div>
  );
}

const ensOpen = (props) => {
  let { nameSearch, entry, bid } = props.state;
  let { classes } = props.props;
  let started = entry["0"] === "1" ? true : false;
  let revealDate = started ? ` before ${timeConverter(entry["2"]-auction.time.reveal)}` : "!";
  let labels = [
    `Labelhash: Keccak256 hash of ${nameSearch} aka labelhash`,
    `Bidder Account: !!must reveal bid using this account!!`,
    "Bid Value (in eth)",
    "Salt: This bit of random info helps hide your bid info :D"
  ];
  return(
    <div>
      <Typography variant="title">{`${nameSearch}.eth is available!`}</Typography>
      <div>
        <Typography variant="subheading">{`Place a bid${revealDate}`}</Typography>

        {bid.map((param, index) => {
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
            onChange={event => props.setBid(event, index)}
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
      onClick={event => props.handleDialog(event, true)}
      children={`Send Bid`}
    />
    </div>
  )
}

//Mode, address, uint, uint, uint   state(_hash), h.deed, h.registrationDate, h.value, h.highestBid

// const checkFin = async(props) => {
//   let { nameSearch } = props.state;
//   let labelhashed = labelhash(nameSearch);
//   let namehashed = namehash.hash(`${nameSearch}.eth`);
//
//   let deedOwner = await
//   let nodeOwner = await ENSRegistry.methods.owner()
// }

const ensOwned = (props) => {
  let { nameSearch, entry } = props.state;
  let { classes } = props.props;
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

const ensReveal = (props) => {
  let { nameSearch, entry, bid } = props.state;
  let { classes } = props.props;
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
            onChange={event => props.setBid(event, index)}
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
      onClick={event => props.revealBid(event)}
      children={`Reveal Bid`}
    />
    </div>
  )
}

const ensForbidden = (props) => {
  let { nameSearch } = props.state;
  let { classes } = props.props;
  return (
    <div>
      <Typography variant="title">{`${nameSearch}.eth is forbidden! :o`}</Typography>
      <div>
        <Typography variant="subheading">{`The state method cant even return this mode atm... lol`}</Typography>
      </div>
    </div>
  )
}

const ensUnavail = (props) => {
  let { nameSearch } = props.state;
  let { classes } = props.props;
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

const ensFinal = (props) => {
  let { nameSearch, deedOwner, bid, currentAcc } = props.state;
  let { classes } = props.props;

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
          onClick={event => props.handleFinalize(event)}
          children={`Finalize`}
        />
      </div>
    </div>
  )
}

class EnsRegistrar extends React.Component {

      state = {
        nameSearch: "",
        entry: "",
        entryState: "",
        bid: ['','','',''],
        dialogOpen: false,
        currentAcc: ''
      };

      setNameSearch(event) {
        this.setState({ nameSearch: namehash.normalize(event.target.value), entry: "", entryState: "", bid: ['','','',''] });
      }

      async setEntry(event) {
        event.persist();
        let { nameSearch } = this.state;
        if(nameSearch.length > 6) {
          let { nameSearch } = this.state;
          let uintArr = new Uint32Array(10);
          let salt = `0x${sha3(window.crypto.getRandomValues(uintArr).join(""))}`;
          let _entry = await HashRegistrar.methods.entries(`0x${sha3(nameSearch)}`).call();

          let deedAddr = _entry["1"];
          let _deedOwner = "";
          let _ensOwner = "";

          if (deedAddr !== "0x0000000000000000000000000000000000000000") {
          _deedOwner = await Contract(DeedABI, deedAddr).methods.owner().call();
          _ensOwner = await ENSRegistry.methods.owner(namehash.hash(`${nameSearch}.eth`)).call();
          }

          let _entryState = _entry["0"];

          if (_entryState === "4") {
            salt = "";
          }

          if (_entryState === "2" && (_deedOwner !== _ensOwner && _ensOwner === "0x0000000000000000000000000000000000000000")) {
            _entryState = "6";
          }

          this.setState(prevState => ({
            entry: _entry,
            entryState: _entryState,
            deedOwner: _deedOwner,
            bid: [...prevState.bid.map((input, index) => {
                if (index === 0 && ((_entry["0"] === "0" || _entry["0"] === "1") || _entry["0"] === "4")) {
                  return `0x${sha3(prevState.nameSearch)}`;
                } else if (index === 3 && (_entry["0"] === "0" || _entry["0"] === "1")) {
                  return salt;
                }
                return "";
              })]
          }));

        }
      }

      setBid(event, _index) {
        event.persist();
        this.setState(prevState => ({
          bid: [...prevState.bid.map((param, index) => (
              _index === index
              ? event.target.value
              : param))]
        }));
      }

      handleSearch(event) {
        if(event.key == 'Enter') {
          this.setEntry(event);
        }
      }

      handleDialog(event, open) {
        event.preventDefault();
        this.setState({dialogOpen: open});
      }

      handleBid(event) {
        event.preventDefault();
        this.handleDialog(event, false);
        let { nameSearch } = this.state;
        let labelhashed = labelhash(nameSearch);
        let weiArr = this.state.bid.map((value, index) => index === 2 ? web3.utils.toWei(value, "ether") : value)
        if (EmbarkJS.isNewWeb3()) {
          HashRegistrar.methods.shaBid.apply(null, weiArr).call()
          .then(sealedBid => HashRegistrar.methods.startAuctionsAndBid([labelhashed], sealedBid)
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
    		let { nameSearch, currentAcc } = this.state;
        let labelhashed = labelhash(nameSearch);
        HashRegistrar.methods.finalizeAuction(labelhashed).send({ from: currentAcc });
      }

      checkAcc(obj) {
        if(!(this.state.currentAcc === obj.selectedAddress)) {
          this.setState({currentAcc: obj.selectedAddress});
        }
      }

      componentDidMount() {
        try {
          if(web3.currentProvider !== null) {
            EmbarkJS.onReady(() => {
              if (EmbarkJS.isNewWeb3()) {

                this.setState({currentAcc: web3.utils.toHex(web3.eth.defaultAccount)});
                web3.currentProvider.publicConfigStore.on('update', obj => this.checkAcc(obj));
                web3.eth.net.getNetworkType((err, type) => networkType = type);

              } else {
                if (EmbarkJS.Messages.providerName === 'whisper') {
                  console.log(Error(`current web3 api not supported`))
                } else {
                  console.log(Error(`web3 provider not detected/mounted`))
                }
              }
            });
          } else {
            console.log(Error(`web3 provider not detected/mounted`))
          }
        }
        catch(err) {
          console.log(err);
        }
      }

      componentWillUnmount() {
        try {
          if (web3.currentProvider !== null){

            web3.currentProvider.publicConfigStore.removeAllListeners();

          }
        }
        catch(err) {
          console.log(err);
        }
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
        onChange={event => this.setNameSearch(event)}
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
          onClick={event => this.setEntry(event, this.state.nameSearch)}
          children={`Search`}
        />
      </div>
      </div>
        <div>
          {entryCheck(this)}
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

export default withMobileDialog()(withStyles(styles)(EnsRegistrar));
