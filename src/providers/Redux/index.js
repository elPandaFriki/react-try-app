import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "../../redux";

const isDevelopment = () => {
  return true;
};

class Redux extends React.Component {
  getStore = () => {
    let middleware = [];
    if (isDevelopment()) {
      const logger = createLogger({
        collapsed: (getState, action, logEntry) => {
          return !logEntry.error;
        },
        predicate: (getState, action) => {
          return true;
        },
      });
      middleware = [thunk, logger];
    } else {
      middleware = [thunk];
    }
    return configureStore({
      reducer: reducers,
      middleware,
    });
  };

  render() {
    return <Provider store={this.getStore()}>{this.props.children}</Provider>;
  }
}

export default Redux;
