import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Asteroids from '../Asteroids';
/*
import ENUMS from "../../constants/enums";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
*/

const useStyles = makeStyles((theme) => {
  return {
    App: {
      width: "100%",
      height: "100vh"
    },
    Asteroids: {
      width: "100%",
      height: "100%"
    }
  }
});

const AppPure = (props) => {
  const classes = useStyles();
  // const selector_id = "demo-simple-select-outlined-label";
  return (
    <div className={classes.App}>
      {/**
       * 
      <p>{props.intlCallback("application")}</p>
      <TextField
        id={selector_id}
        label={"Select Language"}
        placeholder={"Language"}
        variant={"outlined"}
        value={props.language}
        select={true}
        color={"primary"}
        disabled={false}
        fullWidth={true}
        error={false}
        size={"small"}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">Hello There</InputAdornment>
          ),
        }}
        onChange={(e) => {
          props.setLanguage(e.target.value);
        }}
        helperText={"Please select your language"}
      >
        {Object.entries(ENUMS.LanguagePb).map(([key, value]) => {
          return (
            <MenuItem value={value}>
              {props.intlCallback(`LanguagePb.${key}`)}
            </MenuItem>
          );
        })}
      </TextField>
      <select
        id="theme"
        onChange={(e) => {
          props.setTheme();
        }}
        value={props.dark_mode_enabled}
      >
        <option value={true}>Dark</option>
        <option value={false}>Light</option>
      </select>
    */}
      <div className={classes.Asteroids}>
        <Asteroids />
      </div>
    </div>
  );
};

export default AppPure;
