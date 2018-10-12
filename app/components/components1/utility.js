import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

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

class Utility extends React.Component {

      state = {
        currentAcc: '',
        str: '',
        setStr: (event) => {
          this.setState({ str: event.target.value})
        },
        labelhash: () => {
          return '0x' + sha3(this.state.str.split('.')[0])
        },
        namehash: () =>  {
          return namehash.hash(this.state.str)
        },
        sha3: () => {
          return '0x' + sha3(this.state.str)
        }

      }

      handleChange(e) {
        let string = namehash.normalize(e.target.value);
        this.setState({
          valueSet: string,
          labelhashValue: '0x' + sha3(string.split('.')[0]),
          namehashValue: namehash.hash(string)
        });
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

      // <Typography variant="title" children="Create Account" />

      // <Input
      //   className={classes.input}
      //   variant="outlined"
      //   placeholder="example"
      //   inputProps={{
      //     "aria-label": "Description",
      //     endadornment: <InputAdornment position="end">Kg</InputAdornment>,
      //   }}
      //   onChange={event => this.state.setStr(event)}
      //   value={this.state.name}
      // />

      // <div className={classes.indent}>
      //   <div className={classes.field}>
      //     <Button
      //       variant="contained"
      //       color="primary"
      //       className={classes.button}
      //     >
      //       Register
      //     </Button>
      //   </div>
      // </div>

  render() {

    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>

        <div className={classes.indent}>
          <div className={classes.field}>
          <Typography variant="subheading" children="Current Account: " />
          <Typography variant="subheading" children={this.state.currentAcc} />
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
                onChange={event => this.state.setStr(event)}
                value={this.state.str}
              />
            </div>
            <div className={classes.spacer} />

            <div className={classes.output}>
              <div>
                <Typography variant="caption" children="str" />
              <Typography className={classes.typo} variant="body1" children={this.state.str} />
              </div>
              <div>
                <Typography variant="caption" children="labelhash" />
              <Typography className={classes.typo} variant="body1" children={this.state.labelhash()} />
              </div>
              <div>
                <Typography variant="caption" children="namehash" />
              <Typography className={classes.typo} variant="body1" children={this.state.namehash()} />
              </div>
              <div>
                <Typography variant="caption" children="keccak256" />
              <Typography className={classes.typo} variant="body1" children={this.state.sha3()} />
              </div>
            </div>
          </div>
        </div>
        <Divider className={classes.space} />

      </div>
    );
  }
}

Utility.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Utility);
