import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "intl",
  initialState: null,
  reducers: {
    set_intl: (state, action) => {
      return action.payload;
    },
  },
});

export default slice.reducer;
export const { set_intl } = slice.actions;
