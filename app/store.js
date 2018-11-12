import { createStore, combineReducers } from 'redux';

import SubdomainResolver from 'Embark/contracts/SubdomainResolver';


// let config = {
//   rootDomain: "subdomain",
//   referralAddr: "0x232c1526a71A4fD696Bc4B2B7FAA8698A32eB7Fb",
//   resolverAddr: SubdomainResolver.address
// }


//reducers

function appConfigReducer(
  state = {
    rootDomain: "subdomain",
    referralAddr: "0x232c1526a71A4fD696Bc4B2B7FAA8698A32eB7Fb",
    resolverAddr: SubdomainResolver.address
  },
  action) {
  switch (action.type) {
    default:
      return state;
  }
}

function web3Reducer(state = {}, action) {
  let { currentAcc, networkType } = action;
  switch (action.type) {
    case 'SET_ADDR':
      return { ...state, currentAcc: action.addr};
    case 'WEB3_SUCCESS':
      return { ...state, web3: true, currentAcc, networkType };
    case 'WEB3_DISABLED':
      return { ...state, web3: false, currentAcc: 'web3 not injected', networkType };
    case 'WEB3_FAIL':
      return { ...state, web3: false};
    default:
      return state;
  }
}

function navReducer(state = { selectedDrawer: 0, mobileOpen: false }, action) {
  switch (action.type) {
    case 'SET_DRAWER':
      return { ...state, selectedDrawer: action.selected, mobileOpen: false };
    case 'MOBILE_OPEN':
      return { ...state, mobileOpen: action.mobile };
    default:
      return state;
  }
}

function dialoggerReducer(
  state = {
    dialogOpen: false,
    dialogAction: ''
  },
  action) {
  let { dialogOpen, dialogAction } = action;
  switch (action.type) {
    case 'TOGGLE_DIALOG':
      return { ...state, dialogOpen };
    case 'SET_DIALOG':
      return { ...state, dialogOpen, dialogAction };
    case 'WEB3_DISABLED':
      return { ...state, dialogOpen: true, dialogAction: 'ENABLE_ETH' };
    case 'WEB3_ENABLED':
      return { ...state, dialogOpen: false };
    default:
      return state;
  }
}

function txSnackbarReducer(
  state = { snackOpen: false, tx: '', error: null },
  action) {
  let { snackOpen, tx, error } = action;
  switch (action.type) {
    case 'TX_SNACK':
      return { ...state, snackOpen, tx, error };
    case 'CLOSE_SNACK':
      return { ...state, snackOpen: false}
    default:
      return state;
  }
}

function subnameReducer(
  state = {
    subnameSearch: '',
    ownable: false,
    availability: "must be longer than 0 characters :P"
  },
  action) {
  let { subnameSearch, ownable, availability } = action;
  switch (action.type) {
    case 'SET_SUBNAME_SEARCH':
      return { ...state, subnameSearch };
    case 'SET_AVAIL':
      return { ...state, ownable, availability };
    default:
      return state;
  }
}

function advancedUtilReducer(state = { currentTab: 0 }, action) {
  let { currentTab } = action;
  switch (action.type) {
    case 'SET_UTIL_TAB':
      return { ...state, currentTab };
    default:
      return state;
  }
}

function contractReaderReducer(
  state = {
    contract: '',
    method: '',
    inputs: [],
    msgValue: '',
    output: '',
    outputs: [],
    pickerState: true
  },
  action) {
  let { contract, method, inputs, msgValue, output, outputs, pickerState } = action;
  switch (action.type) {
    case 'SET_INPUTS':
      return { ...state, inputs };
    case 'SET_MSG_VALUE':
      return { ...state, msgValue };
    case 'SET_OUTPUTS':
      return { ...state, outputs };
    case 'SET_CONTRACT':
      return { ...state, contract, method, inputs, msgValue, pickerState };
    case 'SET_METHOD':
      return { ...state, method, inputs, msgValue, outputs, pickerState };
    default:
      return state;
  }
}

function ensRegistrarReducer(
  state = {
    nameSearch: '',
    entry: '',
    entryState: '',
    bid: ['','','','']
  },
  action) {
  let { nameSearch, entry, entryState, bid, deedOwner } = action;
  switch (action.type) {
    case 'SET_NAME_SEARCH':
      return { ...state, nameSearch: action.nameSearch, entry: '', entryState: '', bid: ['','','',''] };
    case 'SET_ENTRY':
      return { ...state, entry, entryState, deedOwner, bid };
    case 'SET_BID':
      return { ...state, bid }
    default:
      return state;
  }
}

function toolboxReducer(
  state = {
    hasherInput: '',
    expanded: false
  },
  action) {
  let { hasherInput, expanded } = action;
  switch (action.type) {
    case 'SET_HASHER_INPUT':
      return { ...state, hasherInput };
    case 'TOGGLE_EXPAND':
      return { ...state, expanded };
    default:
      return state;
  }
}

// Combine Reducers
const reducers = combineReducers({
  appConfigState: appConfigReducer,
  web3State: web3Reducer,
  navState: navReducer,
  dialoggerState: dialoggerReducer,
  txSnackbarState: txSnackbarReducer,
  subnameState: subnameReducer,
  advancedUtilState: advancedUtilReducer,
  contractReaderState: contractReaderReducer,
  ensRegistrarState: ensRegistrarReducer,
  toolboxState: toolboxReducer
});

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
