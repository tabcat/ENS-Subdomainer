import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  root: {
    display: "flex",
    maxWidth: 680
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  },
  spacer: {
    marginBottom: theme.spacing.unit * 2,
  }
});

class Home extends React.Component {
  state = {

  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div>
          <Typography variant="title">README</Typography>
          <div className={classes.spacer} />
          <Typography className={classes.spacer} variant="body1">
            Hello, this this is a site for buying <a href="https://ens.domains/" target="_blank">ENS</a> subdomains.
          </Typography>
          <Typography className={classes.spacer} variant="body1">
            The goal is to eventually use these subdomains as 'user accounts'/identities by having them point
            to a contract that stores or links to a sort of user configuration/data store.
            In the contract could be/link to things like a <a href="https://docs.ipfs.io/guides/concepts/cid/" target="_blank">content hash</a>
            of the user's profile website, a message inbox,
            identity related user configuration/storage for dapps using this identity for what an email or a google account
            would traditionally be used for,
            messaging addresses/account references, user generated/curated content and ethereum addresses.
          </Typography>
          <Typography className={classes.spacer} variant="body1">
            A specification of this would allow anyone to build a ui for creating/interacting with these types of 'user accounts'.
          </Typography>
          <Typography className={classes.spacer} variant="body1">
            Preferably editting this information/link to would be done off chain (for speed/tx cost/storage) by storing a mutable link,
            like an <a href="https://docs.ipfs.io/guides/concepts/ipns/" target="_blank">ipns link</a>, in the user config
            contract being pointed to by the subdomain.
          </Typography>
          <Typography className={classes.spacer} variant="body1">
            Why not use &lt;!ethereum || !blockchain&gt;?
          </Typography>
          <Typography variant="body1">
            Ethereum's blockchain creates a nice substrate layer so this could hopefully be interacted with by other dapps in
            the future made by some its large number of devs.
          </Typography>
          <Divider className={classes.divider}/>
          <Typography className={classes.spacer} variant="body1">
            this project is: built with <a href="https://github.com/embark-framework/embark" target="_blank">embark!</a>(thank for all the help); open source!
          </Typography>
          <Typography className={classes.spacer} variant="body1">
            project repo: <a href="https://github.com/tabcat/ENS-Subdomainer" target="_blank">https://github.com/tabcat/ENS-Subdomainer</a>
          </Typography>
          <Typography className={classes.spacer} variant="body1">
            contact: baseless <i>at</i> gmx.com
          </Typography>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
