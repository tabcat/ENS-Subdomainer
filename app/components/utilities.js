import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { connect } from 'react-redux';
import store from '../store';

import ContractReader from './components1/contractReader';
import EnsRegistrar from './components1/ensRegistrar';

import ToolBox from './components1/toolbox';

const styles = {
  root: {
    width: "100%",
  },
};

const tabContent = (comp) => {
  switch(comp.props.currentTab) {
    case 0:
      return (<ContractReader />);
    case 1:
      return (<EnsRegistrar />);
  }
}

class CenteredTabs extends React.Component {
  // state = {
  //   value: 0,
  // };

  changeTab = (event, value) => {
    // this.setState({ value });
    store.dispatch({
      type: 'SET_UTIL_TAB',
      currentTab: value
    })
  };

  render() {
    const { classes, currentTab } = this.props;

    return (
      <div className={classes.root}>
        <div>
        <Paper>
          <Tabs
            value={currentTab}
            onChange={this.changeTab}
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

const mapStateToProps = function(store) {
  return {
    currentTab: store.advancedUtilState.currentTab
  };
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(CenteredTabs));
