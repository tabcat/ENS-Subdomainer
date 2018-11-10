import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

import { connect } from 'react-redux';
import store from '../../store';

import EmbarkJS from 'Embark/EmbarkJS';

import Contracts from "../contractABIs";

const styles = theme => ({
  root: {
    flexWrap: "wrap"
  },
  flex: {
    flexWrap: "wrap",
    display: "flex"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  inputName: {
    marginTop: theme.spacing.unit * 4.5,
    marginRight: theme.spacing.unit,
    minWidth: 60
  },
  input: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    flexWrap: "wrap"
  },
  output: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  textField: {
    maxWidth: 550,
    flexWrap: "wrap"
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  selects: {
    minWidth: 200
  },
  padding: {
    flexGrow: 1,
    padding: theme.spacing.unit * 1.5
  },
  toolbar: theme.mixins.toolbar,
  spacer: {
    marginBottom: theme.spacing.unit * 2
  }
});

const contractList = Object.keys(Contracts).map((contract, index) =>
(<MenuItem value={contract} key={index}>{Contracts[contract].name}</MenuItem>));

const methodList = comp => {
  let { contract } = comp.props;
  if (contract !== "") {
    return Contracts[contract].abi.map((method, index) => {
      if (method.type === "function") {
        return <MenuItem value={index} key={index}>{method.name}</MenuItem>;
      }
    });
  }
};

const selected = comp => {
  let { contract, method } = comp.props;
  let { contractName, methodName } = comp;
  if (contract !== "") {
    if (method !== "") {
      return `${contractName(contract)} / ${methodName(contract, method)}`;
    } else {
      return `${contractName(contract)}`;
    }
  }
};

const methodInputs = (comp) => {
  let { classes, contract, method, inputs } = comp.props;
  if (contract !== "" && method !== "") {
    return Contracts[contract].abi[method].inputs.map((input, index) => {
      return (<div className={classes.flex} key={index}>
        {/* <Typography className={classes.inputName} variant="subheading">
          {input.name}:{" "}
        </Typography> */}
        <TextField
          className={classes.textField}
          label={input.type}
          helperText={input.name}
          variant="outlined"
          style={{ margin: 8 }}
          margin="normal"
          fullWidth
          onChange={event => comp.setInputs(event, index)}
          value={inputs[index]}/>
      </div>);
    });
  }
};

const valueInput = (comp) => {
  let { classes, contract, method, msgValue } = comp.props;
  if (Contracts[contract].abi[method].payable) {
    return(
      <div>
      <Typography align="center" variant="subheading" children={`msg.value`}/>
      <TextField
        className={classes.textField}
        label={`ethers`}
        variant="outlined"
        style={{ margin: 8 }}
        margin="normal"
        fullWidth
        onChange={event => comp.setMsgValue(event)}
        value={msgValue}/>
      </div>
    )
  }
}

const methodOutputs = (comp) => {
  let { classes, contract, method, outputs } = comp.props;
  if (contract !== "" && method !== "") {
    return comp.outputTypes(contract, method).map((type, index) => {
      return (
        <div className={classes.flex} key={index}>
        <TextField
          className={classes.textField}
          label={type}
          variant="outlined"
          style={{ margin: 8 }}
          margin="normal"
          value={outputs[index]}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      </div>
      );
    });
  }
};

const methodCheck = (comp) => {
  let { classes, method } = comp.props;

  if(method !== "") {
    return(
      <div>
      <div className={classes.textField}>
        <Typography align="center" variant="subheading" children={`Input`}/>
        {methodInputs(comp)}
        {valueInput(comp)}
        <Divider className={classes.divider}/>
      </div>
      <div className={classes.spacer}/>
      <div className={classes.spacer}/>
      <div className={classes.spacer}/>
      {outputCheck(comp)}
      <div className={classes.toolbar}/>
      <div>

        {txButton(comp)}

      </div>
    </div>
    )
  }
}

const outputCheck = (comp) => {
  let { classes, contract, method } = comp.props;
  if(Contracts[contract].abi[method].outputs.length !== 0) {
    return(
      <div className={classes.textField}>
        <Typography align="center" variant="subheading" children={`Output`}/>
        {methodOutputs(comp)}
      </div>
    )
  }
}

const txButton = (comp) => {
  let { classes, method, inputs } = comp.props;

  if (method !== "") {
    return (
      <div className={classes.flex}>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        disabled={!(inputs.find(value => value === "") === undefined)}
        onClick={event => comp.confirm(event, comp)}
        >
        Confirm
      </Button>
    </div>
    );
  }
};

// function confirm(event, comp) {
//   event.preventDefault()
//   let { contract, method, msgValue, inputs, currentAcc } = comp.props;
//   let { methodName } = comp;
//   let methodABI = Contracts[contract].abi[method];
//
//   let appliedInputs = inputs.map((input, index) => {
//     if (methodABI.inputs[index].type[methodABI.inputs[index].type.length-1] === "]") {
//       return input.replace(/\s/g,'').split(",");
//     }
//     return input;
//   })
//
//   let tx = Contracts[contract].abi[method].constant === true
//     ? 'call'
//     : 'send';
//
//   let txConfig = Contracts[contract].abi[method].payable
//     ? { from: currentAcc, value: web3.utils.toWei(msgValue, "ether") }
//     : { from: currentAcc }
//
//   if (tx === 'call') {
//     if (EmbarkJS.isNewWeb3()) {
//       Contracts[contract].contractObj.methods[methodName(contract, method)].apply(null, appliedInputs)[tx]()
//         .then((value) => comp.setOutputs(value));
//     } else {
//       console.error('web3 api not supported');
//     }
//   } else {
//     if (EmbarkJS.isNewWeb3()) {
//       Contracts[contract].contractObj.methods[methodName(contract, method)].apply(null, appliedInputs)[tx](txConfig);
//     } else {
//       console.error('web3 api not supported');
//     }
//   }
// }


class ContractReader extends React.Component {

  // state = {
  //   contract: "",
  //   method: "",
  //   inputs: [],
  //   msgValue: '',
  //   output: '',
  //   outputs: [],
  //   pickerState: true,
  // };

  contractName = (contract) => {
    if (this.props.contract !== "") {
      return Contracts[this.props.contract].name;
    }
  }

  methodName = (contract, method) => {
    if (contract !== "") {
      return Contracts[contract].abi[method].name;
    }
  }

  sizeInputs = ( contract, method) => {
    let arr = [];
    let index = 0;
    while (arr.length < Contracts[contract].abi[method].inputs.length) {
      arr[index] = "";
      index++;
    }
    return arr;
  }

  setInputs = (event, _index) => {
    event.persist();
    let { inputs } = this.props;

    // this.setState(prevState => ({
    //   inputs: [...prevState.inputs.map((input, index) => (
    //       _index === index
    //       ? event.target.value
    //       : input))]
    // }));
    let newInputs = inputs.map((input, index) => (
          _index === index
          ? event.target.value
          : input))
    store.dispatch({
      type: 'SET_INPUTS',
      inputs: newInputs
    });
  }


  setMsgValue = (event) => {
    // this.setState({ msgValue: event.target.value })
    store.dispatch({
      type: 'SET_MSG_VALUE',
      msgValue: event.target.value
    });
  }


  sizeOutputs = (contract, method) => {
    let arr = [];
    let index = 0;
    while (arr.length < Contracts[contract].abi[method].outputs.length) {
      arr[index] = "";
      index++;
    }
    return arr;
  }

  setOutputs = (value) => {
    let arr = [];
    let index = 0;

    if (typeof value === 'string') {
      arr = [value];
    } else {
      arr = Object.keys(value).map((key) => value[key]);
    }
    // this.setState({outputs: arr})
    store.dispatch({
      type: 'SET_OUTPUTS',
      outputs: arr
    })
  }

  outputTypes = (contract, method) => {
    return Contracts[contract].abi[method].outputs.map((output, index) => {
      return output.type;
    })
  }

  // selected = () => {
  //   let { contract, method } =
  //   if (this.state.contract !== "") {
  //     if (this.state.method !== "") {
  //       return `${this.state.contractName(contract)} / ${this.state.methodName(contract, method)}`;
  //     } else {
  //       return `${this.state.contractName(contract)}`;
  //     }
  //   }
  // }

  // handleChange = event => {
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //     pickerState: false
  //   });
  // };

  contractChange = event => {
    // this.setState({
    //   [event.target.name]: event.target.value,
    //   method: "",
    //   inputs: [],
    //   msgValue: '',
    //   pickerState: false
    // });
    store.dispatch({
      type: 'SET_CONTRACT',
      contract: event.target.value,
      method: "",
      inputs: [],
      msgValue: '',
      pickerState: false
    })
  };

  methodChange = event => {
    let { contract } = this.props;
    // this.setState({
    //   [event.target.name]: event.target.value,
    //   inputs: this.sizeInputs(contract, event.target.value),
    //   msgValue: '',
    //   outputs: this.sizeOutputs(contract, event.target.value),
    //   pickerState: false
    // });
    store.dispatch({
      type: 'SET_METHOD',
      method: event.target.value,
      inputs: this.sizeInputs(contract, event.target.value),
      msgValue: '',
      outputs: this.sizeOutputs(contract, event.target.value),
      pickerState: false
    })
  };

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

  confirm(event) {
    event.preventDefault()
    let { contract, method, msgValue, inputs, currentAcc } = this.props;
    let { methodName, setOutputs } = this;
    let methodABI = Contracts[contract].abi[method];

    let appliedInputs = inputs.map((input, index) => {
      if (methodABI.inputs[index].type[methodABI.inputs[index].type.length-1] === "]") {
        return input.replace(/\s/g,'').split(",");
      }
      return input;
    })

    let tx = Contracts[contract].abi[method].constant === true
      ? 'call'
      : 'send';

    let txConfig = Contracts[contract].abi[method].payable
      ? { from: currentAcc, value: web3.utils.toWei(msgValue, "ether") }
      : { from: currentAcc }

    if (tx === 'call') {
      if (EmbarkJS.isNewWeb3()) {
        Contracts[contract].contractObj.methods[methodName(contract, method)].apply(null, appliedInputs)[tx]()
          .then((value) => setOutputs(value));
      } else {
        console.error('web3 api not supported');
      }
    } else {
      if (EmbarkJS.isNewWeb3()) {
        Contracts[contract].contractObj.methods[methodName(contract, method)].apply(null, appliedInputs)[tx](txConfig)
        .on("transactionHash", (hash) => this.handleTxHash(null, hash))
        .on("error", (err) => this.handleTxHash(err, undefined));
      } else {
        console.error('web3 api not supported');
      }
    }
  }


  render() {
    const { classes, contract, method, pickerState } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.padding}>
          <div className={classes.flex}>
            <div className={classes.input}>
              <Typography variant="subheading" children="1. Pick a Contract"/>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="contract-helper">Contract</InputLabel>
                <Select className={classes.selects} value={contract} onChange={this.contractChange} input={<Input name="contract" id="contract-helper" />}>
                  {contractList}
                </Select>
              </FormControl>
            </div>
            <div className={classes.input}>
              <Typography variant="subheading" children="2. Pick a Method"/>

              <FormControl className={classes.formControl} disabled={pickerState}>
                <InputLabel htmlFor="method-helper">Method</InputLabel>
                <Select className={classes.selects} value={method} onChange={this.methodChange} input={<Input name="method" id="method-helper" />}>
                  {methodList(this)}
                </Select>
              </FormControl>
            </div>
          </div>
          <Divider className={classes.divider}/>
          <div className={classes.input}>
            <Typography variant="subheading" children={selected(this)}/>
            <div className={classes.toolbar}/>
            {methodCheck(this)}
            <div className={classes.toolbar}/>
          </div>
        </div>
    </div>);
  }
}

const mapStateToProps = function(store) {
  let { contract, method, inputs, msgValue, output, outputs, pickerState } = store.contractReaderState;
  return {
    contract,
    method,
    inputs,
    msgValue,
    output,
    outputs,
    pickerState,
    currentAcc: store.web3State.currentAcc
  };
}

ContractReader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(ContractReader));
