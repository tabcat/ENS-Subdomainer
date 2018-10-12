import React from "react";
import {render} from "react-dom";
import NavDrawer from "./components/navDrawer";

const rootElement = document.querySelector("#root");
if (rootElement) {
  render(<NavDrawer/>, rootElement);
}
