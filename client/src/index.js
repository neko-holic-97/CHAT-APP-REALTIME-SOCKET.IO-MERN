import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import alertTemplate from "react-alert-template-basic";

const options = {
  timeout: 5000,
  positions: positions.BOTTOM_CENTER,
  transitions: transitions.SCALE,
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AlertProvider template={alertTemplate} {...options}>
        <App />
      </AlertProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
