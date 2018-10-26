import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import EmbarkJS from 'Embark/EmbarkJS';

import Home from './home'
import EnsSubdomains from './ensSubdomains';
import Utilities from "./utilities";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    //height: 440,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    margin: theme.spacing.unit,
  },
});


const nav = [
  {
    name: "Home",
    component: () => <Home />
  },
  {
    name: "ENS Subdomains",
    component: () => <EnsSubdomains />
  },
  {
    name: "Advanced Utilities",
    component: () => <Utilities />
  }
]

const navList = (state, navArr) => {


  return navArr.map((navObj, index) => {
    if (index !== 0) {
    return (

        <ListItem
          button
          id={navObj.name}
          key={index}
          selected={state.selectedIndex === index}
          onClick={event => state.selectContent(index, event)}

          >
          <ListItemText primary={navObj.name} />
        </ListItem>


    )
  }
  })
}

const contentRender = (state) => {
  return nav[state.selectedIndex].component();
}



class NavDrawer extends React.Component {
  state = {
    mobileOpen: false,
    selectedIndex: 0,
    selectContent: (index) => {
      this.setState(state => ({
        selectedIndex: index,
        mobileOpen: false
       }))
    },
    selectedName: () => {
      return (
        <Typography
          variant="title"
          color="inherit"
          children={nav[this.state.selectedIndex].name}
          noWrap
        />
      )
    }
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleListItemClick = index => {
    this.setState({
      selectedIndex: index,
      mobileOpen: false
    });
  };

  componentDidMount() {
  EmbarkJS.onReady(() => {
    if (EmbarkJS.isNewWeb3()) {
      EmbarkJS.Messages.Providers.whisper.getWhisperVersion((err, version) => {
        if (!err)
          console.log(`web3 provider mounted successfully`)
        else
          console.log(err);
        }
      );
    } else {
      if (EmbarkJS.Messages.providerName === 'whisper') {
        console.log(Error(`web3 api not supported`))
      } else {
        console.log(Error(`web3 provider not detected/mounted`))
      }
    }

    this.setState({
      selectedIndex: 0,
      storageEnabled: true
    });
  });
}


  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>

          <div className={classes.toolbar} onClick={event => this.state.selectContent(0)} >
            <Typography align="center" variant="headline" >
              {`<Subdomain>.eth`}
            </Typography>
            <Typography align="center" variant="caption">
              v0.0.1
            </Typography>
          </div>

        <Divider />
        <div className={classes.list}>
          <List component="nav">
            {navList(this.state, nav)}
          </List>
        </div>
      </div>
    );

    return (

        <div className={classes.root}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              {this.state.selectedName()}
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {contentRender(this.state)}
          </main>
        </div>

    );
  }
}

NavDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NavDrawer);
