import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { connect } from 'react-redux';
import store from '../store';

import EmbarkJS from 'Embark/EmbarkJS';
import ENSRegistry from 'Embark/contracts/ENSRegistry';
import SubdomainRegistrar from 'Embark/contracts/SubdomainRegistrar';
import SubdomainResolver from 'Embark/contracts/SubdomainResolver';

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;
const toHex = (str) => web3.utils.toHex(str);

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

const sendTest = (event, comp) => {
  event.preventDefault()
  let { rootDomain, name, currentAcc, referralAddr, resolverAddr } = comp.props;

  // bytes32 label, string subdomain, address subdomainOwner, address referrer, address resolver
  let inputs = [rootDomain, name, currentAcc, referralAddr, resolverAddr];

  if (EmbarkJS.isNewWeb3()) {
    SubdomainRegistrar.methods.register.apply(null, inputs)['send']({from: currentAcc});
  } else {
    SubdomainRegistrar.methods.register.apply(null, inputs);
  }
}

class EnsSubdomains extends React.Component {

    currentNode(name) {
      let { rootDomain } = this.props;
      return `${name}.${rootDomain}.eth`;
    }

    setName(event) {
      let newSubnameSearch = namehash.normalize(event.target.value);
      if (!newSubnameSearch.includes(".")) {
        // this.setState({
        //   name: name,
        // });
        store.dispatch({
          type: 'SET_SUBNAME_SEARCH',
          subnameSearch: newSubnameSearch
        })
        this.getAvailability(newSubnameSearch);
      }
    }

    async getAvailability(name) {
      let { rootDomain } = this.props;
      let ownable;
      let availability;
      if (name !== '') {
        let rootDomainOwner = await ENSRegistry.methods.owner(namehash.hash(`${rootDomain}.eth`)).call();
        if(toHex(rootDomainOwner) === toHex(SubdomainRegistrar.address))  {
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
      // this.setState({
      //   ownable: ownable,
      //   available: availability
      // });
      store.dispatch({
        type: 'SET_AVAIL',
        ownable,
        availability
      })
    }

    // async registerSub(event) {
    //   event.preventDefault()
    //   let { rootDomain, name, referralAddr, resolverAddr, currentAcc } = this.props;
    //
    //   // bytes32 label, string subdomain, address subdomainOwner, address referrer, address resolver
    //   let inputs = [`0x${sha3(rootDomain)}`, name, currentAcc, referralAddr, resolverAddr];
    //
    //   if (EmbarkJS.isNewWeb3()) {
    //     SubdomainRegistrar.methods.register.apply(null, inputs).send({ from: currentAcc, value: subnamePrice });
    //     // this.setState({ dialogOpen: false });
    //     store.dispatch({
    //       type: 'TOGGLE_DIALOG',
    //       dialog: false
    //     })
    //   } else {
    //     console.log(Error("requires web3 api v1 or higher"))
    //   }
    // }

    handleDialog(event, open) {
      event.preventDefault();
      // this.setState({dialogOpen: open});
      store.dispatch({
        type: 'SET_DIALOG',
        dialogOpen: true,
        dialogAction: 'SUBNAME_REGI'
      })
    }

  render() {

    const { classes, theme, rootDomain, subnameSearch } = this.props;

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
                  endAdornment: <InputAdornment position="end">{`.${rootDomain}.eth`}</InputAdornment>,
                }}
                helperText={this.props.availability}
                onChange={event => this.setName(event)}
                value={subnameSearch}
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
              disabled={!(this.props.ownable && this.props.name !== '')}
              onClick={event => this.handleDialog(event, true)}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  let { subnameSearch, ownable, availability, dialogOpen } = store.subnameState;
  return {
    subnameSearch,
    ownable,
    availability,
    dialogOpen,
    rootDomain: store.appConfigState.rootDomain,
    referralAddr: store.appConfigState.referralAddr,
    resolverAddr: store.appConfigState.resolverAddr,
    currentAcc: store.web3State.currentAcc
  };
}

EnsSubdomains.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(EnsSubdomains));
