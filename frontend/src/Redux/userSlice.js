import { createSlice } from "@reduxjs/toolkit";
import client from "../functions/client";

const initialState = {
  listUser: (await client.get(`/users`)).data,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.listUser = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

export default userSlice.reducer;
