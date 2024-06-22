import React, { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import CardFriend from "./CardFriend";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "../Redux/chatSlice";
import DataHandler from "../DataHandler";
import { setUsers } from "../Redux/userSlice";

function Home() {
  const user = useLoaderData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.user.listUser);
  const chats = useSelector((state) => state.chat.listChat);
  const [listFriend, setListFriend] = useState();
  const [force, setForce] = useState(true);

  const { getChat, loadUser, getUserById } = DataHandler;

  const capitalizeWords = (word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const rest = word.slice(1).toLowerCase();

    return firstLetter + rest;
  };

  useEffect(() => {
    reload();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    let newUser = users.find((u) => u.id == user.id);
    let userChats = chats.filter(
      (c) => c.from == newUser.id || c.to == newUser.id
    );
    let unreadChats = [];
    let readChats = [];
    for (let i = 0; i < userChats.length; i++) {
      const c = userChats[i];
      if (c.to == newUser.id && c.status == "unread") {
        unreadChats.push(c);
      } else {
        readChats.push(c);
      }
    }
    unreadChats.reverse();
    readChats.reverse();
    let newChats = [...unreadChats, ...readChats];

    let newFriend = [];
    for (let i = 0; i < newChats.length; i++) {
      const c = newChats[i];

      if (c.to == newUser.id) {
        newFriend.push(c.from);
      } else {
        newFriend.push(c.to);
      }
    }

    newFriend = [...new Set(newFriend)];
    for (let i = 0; i < newUser.friends.length; i++) {
      const f = newUser.friends[i];

      if (newFriend.includes(f) == false) {
        newFriend.push(f);
      }
    }

    setListFriend(newFriend);
  }, [chats, users]);

  const updateChat = async () => {
    const response = await getChat();
    dispatch(setChats(response));
  };

  const updateUser = async () => {
    const response = await loadUser();
    dispatch(setUsers(response));
  };

  const reload = () => {
    // Reload
    updateChat();
    updateUser();
    setForce(!force);
  };

  // setInterval(() => {
  //   reload();
  // }, 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      reload();
      setForce(!force);
    }, 1000);
    return () => clearInterval(interval);
  }, [force]);

  const handleSearch = () => {
    // alert(e);
    console.log("search");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-black border-bottom border-3 border-black">
        <div className="d-flex align-items-center w-100">
          <div className="w-100 px-4 py-2">
            <h2 className="text-white">
              Welcome, {user != null && capitalizeWords(user.username)}!
            </h2>
          </div>
          <div className="w-100 d-flex justify-content-center">
            <h2 className="text-white">Besties</h2>
          </div>
          <div className="w-100 d-flex justify-content-end px-5">
            <button
              className="btn rounded-3 text-white fs-4 text-white me-3"
              style={{ backgroundColor: "#7c2023" }}
              onClick={reload}
            >
              Reload
            </button>
            <button
              className="btn rounded-3 text-white fs-4 text-white"
              style={{ backgroundColor: "#7c2023" }}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="w-100 d-flex" style={{ minHeight: "90vh" }}>
        <div
          className="border-end border-5 border-black p-4"
          id="menu"
          style={{ width: "35%" }}
        >
          <div className="d-flex align-items-center w-100">
            <h1 className="ps-3">Home</h1>
          </div>
          <div className="d-flex align-items-center w-100 mt-3">
            <div className="w-100 d-flex justify-content-start">
              <Link to={"/add"}>
                <button
                  className="btn rounded-3 ms-3 fs-4 border-0 text-white"
                  style={{ backgroundColor: "#7c2023" }}
                >
                  Add Friend
                </button>
              </Link>
            </div>
            <div className="w-100 d-flex justify-content-center">
              <Link to={"/allpinned"}>
                <button
                  className="btn rounded-3 fs-4 border-0 text-white"
                  style={{ backgroundColor: "#7c2023" }}
                >
                  All Pinned
                </button>
              </Link>
            </div>
            <div className="w-100 d-flex justify-content-end">
              <Link to={"/broadcast"}>
                <button
                  className="btn rounded-3 me-3 fs-4 border-0 text-white"
                  style={{ backgroundColor: "#7c2023" }}
                >
                  Broadcast
                </button>
              </Link>
            </div>
          </div>
          <div className="d-flex align-items-center w-100 mt-4">
            <div className="w-100 d-flex mx-2">
              <input
                tabIndex={0}
                className="fs-4 rounded-3 px-3 w-100"
                type="search"
                placeholder="Search Friend"
                onKeyDown={handleSearch}
              />
            </div>
          </div>
          <div
            className="row row-cols-1 m-0 mt-4 g-3 d-flex overflow-auto"
            style={{ maxHeight: "60vh" }}
          >
            {listFriend &&
              listFriend.map((f, index) => (
                <CardFriend key={index} id={f} userLogin={user}></CardFriend>
              ))}
          </div>
        </div>
        <div id="chat" style={{ width: "65%" }}>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}

export default Home;
