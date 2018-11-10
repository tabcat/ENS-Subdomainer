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
import store from '../../store';

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;


const styles = theme => ({
  root: {
    flexWrap: "wrap"
  },
  space: {
    margin: theme.spacing.unit * 3,
  },
  subheading: {
    flexWrap: "wrap"
  },
  indent: {
    margin: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 2
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
    margin: theme.spacing.unit,
    flexBasis: 280
  },
  spacer: {
    marginBottom: theme.spacing.unit * 2,
  }
});

function hash(string) {
  return namehash.hash(string);
}

function labelhash(string) {
  if (string !== undefined) {
    return '0x' + sha3(string.split('.')[0]);
  }
}

function keccak256(string) {
  if (string !== undefined) {
    return '0x' + sha3(string);
  }
}

class Utility extends React.Component {

      handleChange(e) {
        let string = namehash.normalize(e.target.value);
        store.dispatch({
          type: 'SET_HASHER_INPUT',
          hasherInput: string
        })
      }


  render() {

    const { classes, theme, str, currentAcc, networkType } = this.props;

    return (
      <div className={classes.root}>

        <div className={classes.indent}>
          <div className={classes.field}>
          <Typography variant="subheading" children="Current Account:" />
          <Typography variant="subheading" children={currentAcc} />
          </div>
          <div className={classes.field}>
          <Typography variant="subheading" children="Network Type:" />
          <Typography variant="subheading" children={networkType} />
          </div>
        </div>

        <Divider className={classes.space} />

        <div className={classes.indent}>
          <Typography variant="subheading" children="Hasher" />
          <div>
            <div className={classes.field}>

              <TextField
                className={classes.textField}
                placeholder="string to hash"
                onChange={event => this.handleChange(event)}
                value={str}
              />
            </div>
            <div className={classes.spacer} />

            <div className={classes.output}>
              <div>
                <Typography variant="caption" children="str" />
              <Typography className={classes.typo} variant="body1" children={str} />
              </div>
              <div>
                <Typography variant="caption" children="labelhash" />
              <Typography className={classes.typo} variant="body1" children={labelhash(str)} />
              </div>
              <div>
                <Typography variant="caption" children="namehash" />
              <Typography className={classes.typo} variant="body1" children={hash(str)} />
              </div>
              <div>
                <Typography variant="caption" children="keccak256" />
              <Typography className={classes.typo} variant="body1" children={keccak256(str)} />
              </div>
            </div>
          </div>
        </div>
        <Divider className={classes.space} />

      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    str: store.toolboxState.hasherInput,
    currentAcc: store.web3State.currentAcc,
    networkType: store.web3State.networkType
  };
}

Utility.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Utility));
