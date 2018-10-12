import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import Contracts from "./contractABIs";

import EmbarkJS from 'Embark/EmbarkJS';

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;


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

  let inputs = [props.state.test, web3.eth.defaultAccount]
  // baseless.eth labelhash^, namehash : 0x382456f41b49cd6cee0c7b066f8dc0df1d655a3c597e3fc0c7fdcb4184c0cd38
  if (EmbarkJS.isNewWeb3()) {
    Contracts[1].contractObj.methods['register'].apply(null, inputs)['send']({from: web3.eth.defaultAccount});
  } else {
    Contracts[1].contractObj['register'].apply(null, inputs);
  }
}

class Account extends React.Component {

      state = {
        name: '',
        setName: (event) => {
          // if (!(namehash.normalize(event.target.value) instanceof Error)) {
          this.setState({
            name: namehash.normalize(event.target.value),
            // placeholder: ""
          })
          // } else {
          //   this.setState({placeholder: `'${event.target.value}' not valid character`})
          // }
        },
        labelhash: () => {
          return '0x' + sha3(this.state.node().split('.')[0])
        },
        namehash: () =>  {
          return namehash.hash(this.state.node())
        },
        rootDomain: ".baseless.eth",
        node: () => {
          return this.state.name.trim() + this.state.rootDomain
        },
        //placeholder: ""
        test: '',
        setTest: (event) => {
          this.setState({
            test: namehash.normalize(event.target.value),
            // placeholder: ""
          })
          // } else {
          //   this.setState({placeholder: `'${event.target.value}' not valid character`})
          // }
        }
      }

      handleChange(e){
        let string = namehash.normalize(e.target.value);
        this.setState({
          valueSet: string,
          labelhashValue: '0x' + sha3(string.split('.')[0]),
          namehashValue: namehash.hash(string)
        });
      }

      // <Input
      //   className={classes.input}
      //   variant="outlined"
      //   placeholder="example"
      //   inputProps={{
      //     "aria-label": "Description",
      //     endadornment: <InputAdornment position="end">Kg</InputAdornment>,
      //   }}
      //   onChange={event => this.state.setName(event)}
      //   value={this.state.name}
      // />

      // <div className={classes.output}>
      //   <div>
      //     <Typography variant="caption" children="node" />
      //   <Typography className={classes.typo} variant="body1" children={this.state.node()} />
      //   </div>
      //   <div>
      //     <Typography variant="caption" children="labelhash" />
      //   <Typography className={classes.typo} variant="body1" children={this.state.labelhash()} />
      //   </div>
      //   <div>
      //     <Typography variant="caption" children="namehash" />
      //   <Typography className={classes.typo} variant="body1" children={this.state.namehash()} />
      //   </div>
      // </div>

  render() {

    const { classes, theme } = this.props;

    const test = (
      <div>
      <Divider className={classes.space} />
      <div className={classes.indent}>
        <Typography variant="subheading" children="Register a Username" />
        <div className={classes.spacer} />
        <div>
          <div className={classes.field}>

            <TextField
              className={classes.textField}
              variant="outlined"
              placeholder={this.state.placeholder}

              helperText="placeholder"
              onChange={event => this.state.setTest(event)}
              value={this.state.test}
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
            onClick={event => sendTest(event, this)}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
    )

    return (
      <div className={classes.root}>
        <Typography variant="title" children="Create Account" />

        <Divider className={classes.space} />

        <div className={classes.indent}>
          <Typography variant="subheading" children="Register a Username" />
          <div className={classes.spacer} />
          <div>
            <div className={classes.field}>

              <TextField
                className={classes.textField}
                variant="outlined"
                placeholder={this.state.placeholder}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{this.state.rootDomain}</InputAdornment>,
                }}
                helperText="placeholder"
                onChange={event => this.state.setName(event)}
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
            >
              Register
            </Button>
          </div>
        </div>
        {test}
      </div>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Account);
