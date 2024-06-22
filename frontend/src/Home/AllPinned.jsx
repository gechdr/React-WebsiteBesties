import { useLoaderData, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.png";
import { useSelector } from "react-redux";
import CardAllPined from "./CardAllPinned";
import { useEffect, useState } from "react";

function AllPinned() {
  const user = useLoaderData();
  const navigate = useNavigate();

  const chats = useSelector((state) => state.chat.listChat);

  const [dummy, setDummy] = useState();
  const [userChats, setUserChats] = useState();

  const reload = () => {
    setDummy(!dummy);
  };

  useEffect(() => {
    let userChats = chats.filter((c) => c.from == user.id || c.to == user.id);
    let pinChats = userChats.filter((c) => c.pin == true);
    setUserChats(pinChats);
    reload();
  }, []);

  const capitalizeWords = (word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const rest = word.slice(1).toLowerCase();

    return firstLetter + rest;
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const back = () => {
    navigate("/home");
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
              className="btn rounded-3 text-white fs-4 text-white"
              style={{ backgroundColor: "#7c2023" }}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="w-100 p-5 d-flex flex-column">
        <div className="w-100 d-flex ">
          <button className="border-0 bg-transparent" onClick={back}>
            <img src={arrow} alt="" />
          </button>
          <h1 className="ms-5 display-4 fw-semibold">All Pinned Message</h1>
        </div>
        <div className="row row-cols-3 g-4 mt-3">
          {userChats &&
            userChats.map((c, index) => (
              <CardAllPined key={index} user={user.id} {...c}></CardAllPined>
            ))}
        </div>
      </div>
    </>
  );
}

export default AllPinned;
