// just a template for a material UI class component
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex",
  }
});

class Template0 extends React.Component {
  state = {

  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      </div>
    );
  }
}

Template0.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Template0);
