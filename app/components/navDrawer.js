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

import TxSnackbar from './txSnackbar';
import Dialogger from './dialogger';

import { connect } from 'react-redux';
import store from '../store';

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
    },
    [theme.breakpoints.down("md")]: {
      width: `100%`
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

const navList = (comp, navArr) => {

  let { selectedDrawer } = comp.props;

  return navArr.map((navObj, index) => {

    if (index !== 0) {
    return (

        <ListItem
          button
          id={navObj.name}
          key={index}
          selected={selectedDrawer === index}
          onClick={event => comp.selectContent(index, event)}

          >
          <ListItemText primary={navObj.name} />
        </ListItem>


    )
  }
  })
}

const contentRender = (comp) => {
  if (comp.props.selectedDrawer !== undefined) {
    let { selectedDrawer } = comp.props;
    return nav[selectedDrawer].component();
  }
}



class NavDrawer extends React.Component {

      // state = {
      //   mobileOpen: false,
      //   selectedIndex: 0
      // };

      selectContent = index => {
        // this.setState(state => ({
        //   selectedIndex: index,
        //   mobileOpen: false
        //  }))
        store.dispatch({
          type: 'SET_DRAWER',
          selected: index
        })
      }

      selectedName = () => {
        if (this.props.selectedDrawer !== undefined) {
          return (
            <Typography
              variant="title"
              color="inherit"
              children={nav[this.props.selectedDrawer].name}
              noWrap
            />
          )
        }
      }

      handleDrawerToggle = () => {
        // this.setState(state => ({ mobileOpen: !state.mobileOpen }));
        store.dispatch({
          type: 'MOBILE_OPEN',
          mobile: !this.props.mobileOpen
        })
      };

      handleListItemClick = index => {
        // this.setState({
        //   selectedIndex: index,
        //   mobileOpen: false
        // });
        store.dispatch({
          type: 'SET_DRAWER',
          selected: index
        })
      };

      checkAcc(obj) {
        let { currentAcc } = this.props;
        if(!(currentAcc === obj.selectedAddress) && (currentAcc !== undefined && obj.selectedAddress !== undefined)) {
          // this.setState({currentAcc: obj.selectedAddress});
          store.dispatch({
            type: 'SET_ADDR',
            addr: obj.selectedAddress
          })
        }
      }

      componentDidMount() {
        try {
          let init = 'WEB3_FAIL';
          let addr = 'web3 not connected';
          EmbarkJS.onReady(() => {
            if (EmbarkJS.isNewWeb3()) {
                  init = 'WEB3_SUCCESS';
                  addr = web3.utils.toHex(web3.eth.defaultAccount);
                  web3.currentProvider.publicConfigStore.on('update', obj => this.checkAcc(obj));
                  if (addr !== null && typeof ethereum.enable === 'function') {
                    ethereum.enable()
                  }
            } else {
              if (EmbarkJS.Messages.providerName === 'whisper') {
                return console.log(Error(`current web3 api not supported`))
              } else {
                return console.log(Error(`web3 provider not detected/mounted`))
              }
            }

            let msg = `web3 provider mounted successfully`;
            if (addr === null) {
              init = 'WEB3_DISABLED';
              msg = `please enable web3 access`
            }            
            web3.eth.net.getNetworkType((err, type) => {
              store.dispatch({
                type: init,
                currentAcc: addr,
                networkType: type
              });
              return console.log(msg);
            });
          });
        }
        catch(err) {
          console.log(err);
          store.dispatch({
            type: 'WEB3_FAIL'
          })
        }
      }


  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>

          <div className={classes.toolbar} onClick={event => this.selectContent(0)} >
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
            {navList(this, nav)}
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
              {this.selectedName()}
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.props.mobileOpen}
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
            {contentRender(this)}
          </main>
          <div>
            <Dialogger/>
            <TxSnackbar/>
          </div>
        </div>

    );
  }
}

const mapStateToProps = function(store) {
  return {
    mobileOpen: store.navState.mobileOpen,
    selectedDrawer: store.navState.selectedDrawer,
    currentAcc: store.web3State.currentAcc
  };
}

NavDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(NavDrawer));
