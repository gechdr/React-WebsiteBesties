import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import Error from "./Error.jsx";
import Home from "./Home/Home.jsx";
import DataHandler from "./DataHandler.jsx";
import Chat from "./Home/Chat.jsx";
import Add from "./Add/Add.jsx";
import ActiveChat from "./Home/ActiveChat.jsx";
import PinChat from "./Home/PinChat.jsx";
import AllPinned from "./Home/AllPinned.jsx";
import Broadcast from "./Home/Broadcast.jsx";

const { userLogin, authChat } = DataHandler;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
      {
        path: "home",
        loader: userLogin,
        element: <Home></Home>,
        children: [
          {
            index: true,
            element: <Chat></Chat>,
          },
          {
            path: "chat/:id",
            loader: authChat,
            element: <ActiveChat></ActiveChat>,
          },
        ],
      },
      {
        path: "add",
        loader: userLogin,
        element: <Add></Add>,
      },
      {
        path: "home/chat/:id/pin",
        loader: userLogin,
        element: <PinChat></PinChat>,
      },
      {
        path: "/allpinned",
        loader: userLogin,
        element: <AllPinned></AllPinned>,
      },
      {
        path: "/broadcast",
        loader: userLogin,
        element: <Broadcast></Broadcast>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
