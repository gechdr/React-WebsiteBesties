import { createSlice } from "@reduxjs/toolkit";
import client from "../functions/client";

const initialState = {
  listChat: (await client.get(`/chats`)).data,
  activeChat: null,
};

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.listChat = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
  },
});

export const { setChats, setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
