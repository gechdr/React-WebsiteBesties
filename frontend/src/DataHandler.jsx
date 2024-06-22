import { redirect } from "react-router-dom";
import client from "./functions/client";

/**
 * Fungsi loadCatalog dan getCatalog merupakan sebuah fungdi loader.
 * Fungsi loader digunakan untuk mendapatkan data pada halaman yang disetting.
 * Fungsi loader akan dijalankan sebelum element selesai dirender.
 * Loader juga dapat mengakses beberapa data melalui parameter fungsi.
 * Data yang dipassing pada parameter fungsi adalah context, params, dan request
 * Dengan akses request, loader mampu mengakses parameter pada URL seperti pada getCatalog
 */
const loadUser = async () => {
  const getUsers = await client.get(`/users`);
  const data = getUsers.data;
  return data;
};

const getUser = async (username) => {
  const getUsers = await client.get(`/users?username=${username}`);
  return getUsers.data;
};

const getUserById = async (id) => {
  const getUsers = await client.get(`/users/:${id}`);
  return getUsers.data;
};

const getToken = async (id) => {
  const getToken = await client.post(`/login`, {
    id: id,
  });
  return getToken.data;
};

const regisUser = async (username, password, phoneNumber) => {
  const response = await client.post(`/users`, {
    username: username,
    password: password,
    phoneNumber: phoneNumber,
  });

  return response;
};

const userLogin = async () => {
  if (localStorage.loggedData) {
    const getUser = await client.post(`/users`, {
      token: localStorage.loggedData,
    });
    return getUser.data;
  } else {
    return redirect("/");
  }
};

const addFriend = async (id, friendId) => {
  try {
    const add = await client.put(`/users/${id}/add`, {
      friendId: friendId,
    });
  } catch (error) {
    console.log(error);
  }
  return null;
};

const authChat = async (data) => {
  const { params } = data;

  const response = await userLogin();

  if (params.id != response.id) {
    throw new Response("", { status: 403 });
  }

  return null;
};

const getChat = async () => {
  const response = await client.get(`/chats`);
  return response.data;
};

const getChatById = async (id) => {
  const response = await client.get(`/chats/${id}`);
  return response.data;
};

const updatePin = async (id) => {
  const response = await client.put(`/chats/${id}/pin`);
  return response.data;
};

const updateStatus = async (userId, friendId) => {
  const response = await client.put(`/chats/status`, {
    userId: userId,
    friendId: friendId,
  });
  return response.data;
};

const deleteChat = async (id) => {
  const response = await client.delete(`/chats/${id}`);
  return response.data;
};

const newChat = async (from, to, chat) => {
  const response = await client.post(`/chats`, {
    from: from,
    to: to,
    chat: chat,
  });
  return response.data;
};

export default {
  loadUser,
  getUser,
  getUserById,
  getToken,
  regisUser,
  userLogin,
  addFriend,
  authChat,
  getChat,
  getChatById,
  updatePin,
  updateStatus,
  deleteChat,
  newChat,
};
