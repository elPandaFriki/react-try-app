import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components";
import * as serviceWorker from "./serviceWorker";
import Providers from "./providers";

ReactDOM.render(
  <React.StrictMode>
    <Providers.Redux>
      <Providers.SocketIO useRedux={true}>
        <Providers.Intl useRedux={true}>
          <Providers.Theme>
            <App />
          </Providers.Theme>
        </Providers.Intl>
      </Providers.SocketIO>
    </Providers.Redux>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
