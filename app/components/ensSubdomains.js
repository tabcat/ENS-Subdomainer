import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import EmbarkJS from 'Embark/EmbarkJS';
import ENSRegistry from 'Embark/contracts/ENSRegistry';
import SubdomainRegistrar from 'Embark/contracts/SubdomainRegistrar';
import SubdomainResolver from 'Embark/contracts/SubdomainResolver';

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;

const subnamePrice = web3.utils.toWei('0.002', 'ether');

const styles = theme => ({
  root: {
    flexWrap: "wrap"
  },
  space: {
    margin: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit
  },
  subheading: {
    flexWrap: "wrap"
  },
  indent: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  field: {
    display: "flex",
    flexWrap: "wrap",
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  input: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    flexWrap: "wrap",
    display: "flex",
    minWidth: 150,
    maxWidth: 300,
  },
  sector: {
    padding: 0,
    margin: 0
  },
  output: {
    width: 300
  },
  typo: {
    height: 25
  },
  textField: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    flexBasis: 280
  },
  spacer: {
    marginBottom: theme.spacing.unit * 2,
  }
});

const sendTest = (event, props) => {
  event.preventDefault()
  let { rootDomain, name, referralAddr, currentAcc } = props.state;

  // bytes32 label, string subdomain, address subdomainOwner, address referrer, address resolver
  let inputs = [rootDomain, name, currentAcc, referralAddr, resolverAddr];

  if (EmbarkJS.isNewWeb3()) {
    SubdomainRegistrar.methods.register.apply(null, inputs)['send']({from: currentAcc});
  } else {
    SubdomainRegistrar.methods.register.apply(null, inputs);
  }
}

class EnsSubdomains extends React.Component {

      state = {
        rootDomain: "",
        name: '', // subdomain.eth
        ownable: true,
        available: "must be longer than 0 characters :P",
        referralAddr: "",
        resolverAddr: "",
        dialogOpen: false,
        currentAcc: ""
      }

      currentNode(name) {
        let { rootDomain } = this.state;
        return `${name}.${rootDomain}.eth`;
      }

      setName(event) {
        let name = namehash.normalize(event.target.value);
        if (!name.includes(".")) {
          this.setState({
            name: name,
          });
          this.getAvailability(name);
        }
      }

      async getAvailability(name) {
        let { rootDomain } = this.state;
        let ownable;
        let availability;
        if (name !== '') {
          let rootDomainOwner = await ENSRegistry.methods.owner(namehash.hash(`${name}${rootDomain}.eth`));
          if(rootDomainOwner === SubdomainRegistrar.address)  {
            let namehashed = namehash.hash(this.currentNode(name));
            let ensOwner = await ENSRegistry.methods.owner(namehashed).call();
            ownable = ensOwner === "0x0000000000000000000000000000000000000000" ? true : false;
            availability = ensOwner === "0x0000000000000000000000000000000000000000" ? "available!" : "unavailable :(";
          } else {
            ownable = false;
            availability = "subdomain registration is not configured";
          }
        } else {
          ownable = false;
          availability = "must be longer than 0 characters :P";
        }
        this.setState({
          ownable: ownable,
          available: availability
        });
      }

      async registerSub(event) {
        event.preventDefault()
        let { rootDomain, name, referralAddr, resolverAddr, currentAcc } = this.state;

        // bytes32 label, string subdomain, address subdomainOwner, address referrer, address resolver
        let inputs = [`0x${sha3(rootDomain)}`, name, currentAcc, referralAddr, resolverAddr];

        if (EmbarkJS.isNewWeb3()) {
          SubdomainRegistrar.methods.register.apply(null, inputs).send({ from: currentAcc, value: subnamePrice });
          this.setState({ dialogOpen: false });
        } else {
          console.log(Error("requires web3 api v1 or higher"))
        }
      }

      handleDialog(event, open) {
        event.preventDefault();
        this.setState({dialogOpen: open});
      }

      checkAcc(obj) {
        if(!(this.state.currentAcc === obj.selectedAddress)) {
          this.setState({currentAcc: obj.selectedAddress});
        }
      }

      componentDidMount() {
        this.setState({
          rootDomain: "subdomain",
          referralAddr: "0x232c1526a71A4fD696Bc4B2B7FAA8698A32eB7Fb",
          resolverAddr: SubdomainResolver.address,
          currentAcc: web3.utils.toHex(web3.eth.defaultAccount)
        });
        web3.currentProvider.publicConfigStore.on('update', obj => this.checkAcc(obj));
      }

      componentWillUnmount() {
        web3.currentProvider.publicConfigStore.removeAllListeners();
      }

  render() {

    const { classes, theme, fullScreen } = this.props;

    const dialog = (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.dialogOpen}
          onClose={event => this.handleDialog(event,false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{`Are you sure you want to register ${this.currentNode(this.state.name)} for 0.002eth?`}</DialogTitle>
          <DialogContent>
            <DialogContentText>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={event => this.handleDialog(event, false)} color="primary">
              Cancel
            </Button>
            <Button onClick={event => this.registerSub(event)} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )

    return (
      <div className={classes.root}>
        <Typography variant="title" children="Purchase an ENS Subdomain" />
        <div className={classes.spacer} />
        <Typography
          variant="body1"
          children="you can send eth to your easy to remember Ethereum Name Service domains (eg. sub.subdomain.eth) with supported wallets."
        />
        <Typography
          variant="body1"
          children="resolves a human readable name to an ethereum wallet address!  (eg. sub.subdomain.eth -> 0x232...7Fb)"
        />

        <Divider className={classes.space} />

        <div className={classes.indent}>
          <Typography variant="subheading" children="Choose a name for your subdomain" />
          <div className={classes.spacer} />
          <div>
            <div className={classes.field}>

              <TextField
                className={classes.textField}
                variant="outlined"
                placeholder={`subname`}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{`.${this.state.rootDomain}.eth`}</InputAdornment>,
                }}
                helperText={this.state.available}
                onChange={event => this.setName(event)}
                value={this.state.name}
              />
            </div>
            <div className={classes.spacer} />
            <div className={classes.spacer} />


          </div>
        </div>
        <div className={classes.indent}>
          <div className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={!(this.state.ownable && this.state.name !== '')}
              onClick={event => this.handleDialog(event, true)}
            >
              Register
            </Button>
          </div>
        </div>
        <div>
          {dialog}
        </div>
      </div>
    );
  }
}

EnsSubdomains.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(withStyles(styles, { withTheme: true })(EnsSubdomains));
