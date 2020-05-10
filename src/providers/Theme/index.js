import { compose } from "recompose";
import { connect } from "react-redux";
import _ from "lodash";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import palettes from "./palettes";
import React from "react";

export default compose(
  connect((state, props) => {
    return {
      dark_mode_enabled: _.get(state, "client.dark_mode_enabled"),
    };
  }, null)
)((props) => {
  const theme = createMuiTheme({
    palette: props.dark_mode_enabled ? palettes.dark : palettes.light,
    typography: {
      useNextVariants: true,
    },
  });
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
});
