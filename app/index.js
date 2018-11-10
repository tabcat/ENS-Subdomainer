import React from "react";
import { render } from "react-dom";

import { Provider } from 'react-redux';
import store from './store';

import NavDrawer from "./components/navDrawer";

const rootElement = document.querySelector("#root");

if (rootElement) {
  render(
    <Provider store={store}>
      <NavDrawer/>
    </Provider>,
     rootElement);
}
