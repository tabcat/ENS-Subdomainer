import { createStore, combineReducers } from 'redux';

import SubdomainResolver from 'Embark/contracts/SubdomainResolver';


let config = {
  rootDomain: "subdomain",
  referralAddr: "0x232c1526a71A4fD696Bc4B2B7FAA8698A32eB7Fb",
  resolverAddr: SubdomainResolver.address
}


//reducers

function appConfigReducer(state = {}, action) {
  switch (action.type) {
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      let { rootDomain, referralAddr, resolverAddr } = config;
      return { ...state, rootDomain, referralAddr, resolverAddr};
    default:
      return state;
  }
}

function web3Reducer(state = {}, action) {
  let { currentAcc, networkType } = action;
  switch (action.type) {
    case 'SET_ADDR':
      return { ...state, currentAcc: action.addr};
    case 'INIT_SUCCESS':
      return { ...state, web3: true, currentAcc, networkType };
    case 'INIT_FAIL':
      return { ...state, web3: false};
    default:
      return state;
  }
}

function navReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_DRAWER':
      return { ...state, selectedDrawer: action.selected, mobileOpen: false };
    case 'MOBILE_OPEN':
      return { ...state, mobileOpen: action.mobile };
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return { ...state, selectedDrawer: 0, mobileOpen: false };
    default:
      return state;
  }
}

function dialoggerReducer(state = { dialogOpen: false }, action) {
  let { dialogOpen, dialogAction } = action;
  switch (action.type) {
    case 'TOGGLE_DIALOG':
      return { ...state, dialogOpen };
    case 'SET_DIALOG':
      return { ...state, dialogOpen, dialogAction };
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return {
        ...state,
        dialogOpen: false,
        dialogAction: ''
      };
    default:
      return state;
  }
}

function txSnackbarReducer(state = {}, action) {
  let { snackOpen, tx, error } = action;
  switch (action.type) {
    case 'TX_SNACK':
      return { ...state, snackOpen, tx, error };
    case 'CLOSE_SNACK':
      return { ...state, snackOpen: false}
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return { ...state, snackOpen: false, tx: '', error: null };
    default:
      return state;
  }
}

function subnameReducer(state = {}, action) {
  let { subnameSearch, ownable, availability } = action;
  switch (action.type) {
    case 'SET_SUBNAME_SEARCH':
      return { ...state, subnameSearch };
    case 'SET_AVAIL':
      return { ...state, ownable, availability };
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return {
        ...state,
        subnameSearch: '',
        ownable: false,
        availability: "must be longer than 0 characters :P",
      };
    default:
      return state;
  }
}

function advancedUtilReducer(state = {}, action) {
  let { currentTab } = action;
  switch (action.type) {
    case 'SET_UTIL_TAB':
      return { ...state, currentTab };
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return {
        ...state,
        currentTab: 0
      };
    default:
      return state;
  }
}

function contractReaderReducer(state = {}, action) {
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
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return {
        ...state,
        contract: '',
        method: '',
        inputs: [],
        msgValue: '',
        output: '',
        outputs: [],
        pickerState: true,
      };
    default:
      return state;
  }
}

function ensRegistrarReducer(state = {}, action) {
  let { nameSearch, entry, entryState, bid, deedOwner } = action;
  switch (action.type) {
    case 'SET_NAME_SEARCH':
      return { ...state, nameSearch: action.nameSearch, entry: '', entryState: '', bid: ['','','',''] };
    case 'SET_ENTRY':
      return { ...state, entry, entryState, deedOwner, bid };
    case 'SET_BID':
      return { ...state, bid }
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return {
        ...state,
        nameSearch: '',
        entry: '',
        entryState: '',
        bid: ['','','','']
      };
    default:
      return state;
  }
}

function toolboxReducer(state = {}, action) {
  let { hasherInput, expanded } = action;
  switch (action.type) {
    case 'SET_HASHER_INPUT':
      return { ...state, hasherInput };
    case 'TOGGLE_EXPAND':
      return { ...state, expanded };
    case 'INIT_SUCCESS':
    case 'INIT_FAIL':
      return {
        ...state,
        hasherInput: '',
        expanded: false
      };
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
