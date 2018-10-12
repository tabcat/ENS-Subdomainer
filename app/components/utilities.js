import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ContractReader from './components1/contractReader';
import EnsRegistrar from './components1/ensRegistrar';

import ToolBox from './components1/toolbox';

const styles = {
  root: {
    flexGrow: 1,
  },
};

const tabContent = (props) => {
  switch(props.state.value) {
    case 0:
      return (<ContractReader />);
      break;
    case 1:
      return (<EnsRegistrar />);
      break;

  }
}

class CenteredTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div>
        <Paper className={classes.root}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="off"
          >
            <Tab label="Contract Reader" />
            <Tab label="ENS Auction" />
          </Tabs>
        </Paper>
      </div>
      <div>
        {tabContent(this)}
      </div>
      <ToolBox />
      </div>
    );
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenteredTabs);
