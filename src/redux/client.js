import { createSlice } from "@reduxjs/toolkit";
import ENUMS from "../constants/enums";

const slice = createSlice({
  name: "client",
  initialState: {
    language: ENUMS.LanguagePb.ENGLISH,
    dark_mode_enabled: false,
  },
  reducers: {
    set_language: (state, action) => {
      return {
        ...state,
        language: action.payload,
      };
    },
    toggle_color_mode: (state, action) => {
      return {
        ...state,
        dark_mode_enabled: !state.dark_mode_enabled,
      };
    },
  },
});

export default slice.reducer;
export const { set_language, toggle_color_mode } = slice.actions;
