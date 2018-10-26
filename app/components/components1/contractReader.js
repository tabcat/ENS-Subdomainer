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

const contractList = Object.keys(Contracts).map((contract, index) => (<MenuItem value={contract} key={index}>{Contracts[contract].name}</MenuItem>));

const methodList = state => {

  if (state.contract !== "") {

    return Contracts[state.contract].abi.map((method, index) => {

      if (method.type === "function") {
        return <MenuItem value={index} key={index}>{method.name}</MenuItem>;
      }
    });
  }
};

const selected = state => {
  if (state.contract !== "") {
    if (state.method !== "") {
      return `${state.contractName()} / ${state.methodName()}`;
    } else {
      return `${state.contractName()}`;
    }
  }
};

const methodInputs = (state, classes) => {
  let contract = state.contract;
  let method = state.method;
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
          onChange={event => state.setInputs(event, index)}
          value={state.inputs[index]}/>
      </div>);
    });
  }
};

const valueInput = (state, classes) => {
  if (Contracts[state.contract].abi[state.method].payable) {
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
        onChange={event => state.setMsgValue(event)}
        value={state.msgValue}/>
      </div>
    )
  }
}

const methodOutputs = (state, classes) => {
  let contract = state.contract;
  let method = state.method;
  if (contract !== "" && method !== "") {
    return state.outputTypes(contract, method).map((type, index) => {
      return (
        <div className={classes.flex} key={index}>
          {/* <div className={classes.inputName} /> */}
        <TextField
          className={classes.textField}
          label={type}
          variant="outlined"
          style={{ margin: 8 }}
          margin="normal"
          value={state.outputs[index]}
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

const methodCheck = (props, classes) => {
  let state = props.state;

  if(state.method !== "") {
    //let outputCheck = (Contracts[state.contract].abi[state.method].outputs)

    return(
      <div>
      <div className={classes.textField}>
        <Typography align="center" variant="subheading" children={`Input`}/>
        {methodInputs(state, classes)}
        {valueInput(state, classes)}
        <Divider className={classes.divider}/>
      </div>
      <div className={classes.spacer}/>
      <div className={classes.spacer}/>
      <div className={classes.spacer}/>
      {outputCheck(props, classes)}
      <div className={classes.toolbar}/>
      <div>

        {txButton(props, classes)}

      </div>
    </div>
    )
  }
}

const outputCheck = (props, classes) => {
  let state = props.state;
  if(Contracts[state.contract].abi[state.method].outputs.length !== 0) {
    return(
      <div className={classes.textField}>
        <Typography align="center" variant="subheading" children={`Output`}/>
        {methodOutputs(state, classes)}
      </div>
    )
  }
}

const txButton = (props, classes) => {
  let state = props.state

  if (state.method !== "") {
    return (
      <div className={classes.flex}>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        disabled={!(state.inputs.find(value => value === "") === undefined)}
        onClick={event => confirm(event, props)}
        >
        Confirm
      </Button>
    </div>
    );
  }
};

function confirm(event, props) {
  event.preventDefault()

  let state = props.state;
  let { contract, method, msgValue, currentAcc } = props.state;
  let methodABI = Contracts[contract].abi[method];

  let inputs = state.inputs.map((input, index) => {
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

    // if (tx === 'call') {
    //   if (EmbarkJS.isNewWeb3()) {
    //     Contracts[state.contract].contractObj.methods[state.methodName()].apply(null, state.inputs)[tx]()
    //       .then(_value => props.setState({output: _value}));
    //   } else {
    //     Contracts[state.contract].contractObj[state.methodName()].apply(null, state.inputs);
    //   }
    // }

  if (tx === 'call') {
    if (EmbarkJS.isNewWeb3()) {
      Contracts[contract].contractObj.methods[state.methodName()].apply(null, inputs)[tx]()
        .then((value) => state.setOutputs(contract, method, value));
    } else {
      Contracts[contract].contractObj[state.methodName()].apply(null, inputs)
        .then((value) => state.setOutputs(contract, method, value));
    }
  } else {
    if (EmbarkJS.isNewWeb3()) {
      Contracts[contract].contractObj.methods[state.methodName()].apply(null, inputs)[tx](txConfig);
    } else {
      Contracts[contract].contractObj[state.methodName()].apply(null, inputs);
    }
  }
}


class ContractReader extends React.Component {
  state = {
    contract: "",
    contractName: () => {
      if (this.state.contract !== "") {
        return Contracts[this.state.contract].name;
      }
    },
    method: "",
    methodName: () => {
      if (this.contract !== "") {
        return Contracts[this.state.contract].abi[this.state.method].name;
      }
    },
    inputs: [],
    sizeInputs: method => {
      let arr = [];
      let index = 0;
      while (arr.length < Contracts[this.state.contract].abi[method].inputs.length) {
        arr[index] = "";
        index++;
      }
      return arr;
    },
    setInputs: (event, _index) => {
      event.persist();

      this.setState(prevState => ({
        inputs: [...prevState.inputs.map((input, index) => (
            _index === index
            ? event.target.value
            : input))]
      }));
    },
    msgValue: '',
    setMsgValue: (event) => {
      this.setState({ msgValue: event.target.value })
    },
    output: '',
    outputs: [],
    sizeOutputs: method => {
      let arr = [];
      let index = 0;
      while (arr.length < Contracts[this.state.contract].abi[method].outputs.length) {
        arr[index] = "";
        index++;
      }
      return arr;
    },
    setOutputs: (contract, method, value) => {
      let arr = [];
      let index = 0;

      if (typeof value === 'string') {
        arr = [value];
      } else {
        arr = Object.keys(value).map((key) => value[key]);
      }
      // while (arr.length < Contracts[contract].abi[method].outputs.length) {
      //   arr[index] = args[index];
      //   index++;
      // }
      this.setState({outputs: arr})
    },
    outputTypes: (contract, method) => {
      return Contracts[contract].abi[method].outputs.map((output, index) => {
        return output.type;
      })
    },
    selected: () => {
      if (this.state.contract !== "") {
        if (this.state.method !== "") {
          return `${this.state.contractName()} / ${this.state.methodName()}`;
        } else {
          return `${this.state.contractName()}`;
        }
      }
    },
    pickerState: true,
    currentAcc: web3.eth.defaultAccount,
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      pickerState: false
    });
  };

  contractChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      method: "",
      inputs: [],
      msgValue: '',
      pickerState: false
    });
  };

  methodChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      inputs: this.state.sizeInputs(event.target.value),
      msgValue: '',
      outputs: this.state.sizeOutputs(event.target.value),
      pickerState: false
    });
  };

  checkAcc(obj) {
    if(!(this.state.currentAcc === obj.selectedAddress)) {
      this.setState({currentAcc: obj.selectedAddress});
    }
  }

  componentDidMount() {
    web3.currentProvider.publicConfigStore.on('update', obj => this.checkAcc(obj));
  }

  componentWillUnmount() {
    web3.currentProvider.publicConfigStore.removeAllListeners();
  }

  render() {
    const {classes} = this.props;

    // const txButton = (
    //   <div className={classes.flex}>
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       className={classes.button}
    //       disabled={ !(this.state.method !== '' && this.state.inputs.find(value => value === "") === undefined) }
    //     >
    //       Confirm
    //     </Button>
    //   </div>
    // )

    return (
      <div className={classes.root}>
        <div className={classes.padding}>
          <div className={classes.flex}>
            <div className={classes.input}>
              <Typography variant="subheading" children="1. Pick a Contract"/>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="contract-helper">Contract</InputLabel>
                <Select className={classes.selects} value={this.state.contract} onChange={this.contractChange} input={<Input name = "contract" id = "contract-helper" />}>
                  {contractList}
                </Select>
              </FormControl>
            </div>
            <div className={classes.input}>
              <Typography variant="subheading" children="2. Pick a Method"/>

              <FormControl className={classes.formControl} disabled={this.state.pickerState}>
                <InputLabel htmlFor="method-helper">Method</InputLabel>
                <Select className={classes.selects} value={this.state.method} onChange={this.methodChange} input={<Input name = "method" id = "method-helper" />}>
                  {methodList(this.state)}
                </Select>
              </FormControl>
            </div>
          </div>
          <Divider className={classes.divider}/>
          <div className={classes.input}>
            <Typography variant="subheading" children={selected(this.state)}/>
            <div className={classes.toolbar}/>
            {methodCheck(this, classes)}
            <div className={classes.toolbar}/>
          </div>
        </div>
    </div>);
  }
}

ContractReader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContractReader);
