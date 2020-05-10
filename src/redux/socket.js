import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "socket",
  initialState: null,
  reducers: {
    set_socket: (state, action) => {
      return action.payload;
    },
  },
});

export default slice.reducer;
export const { set_socket } = slice.actions;
