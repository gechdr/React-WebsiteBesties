import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.png";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useSelector } from "react-redux";
import DataHandler from "../DataHandler";

function PinChat() {
  const user = useLoaderData();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user.listUser);
  const chats = useSelector((state) => state.chat.listChat);
  const active = useSelector((state) => state.chat.activeChat);

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
    navigate(`/home/chat/${user.id}`);
  };

  let friendUser;
  let currentChats;
  if (active == null) {
    navigate("/home");
  } else {
    friendUser = users.find((u) => u.id == active.friendId);
    let userChats = chats.filter(
      (c) => c.from == active.userId || c.to == active.userId
    );
    currentChats = userChats.filter(
      (c) => c.from == active.friendId || c.to == active.friendId
    );
    currentChats = currentChats.filter((c) => c.pin == true);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-black border-bottom border-3 border-black">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="w-100 px-4 py-2">
              <h1 className="text-white">
                Welcome, {user != null && capitalizeWords(user.username)}!
              </h1>
            </div>
            <div className="w-100 d-flex justify-content-center">
              <h1 className="text-white">Besties</h1>
            </div>
            <div className="w-100 d-flex justify-content-end px-5">
              <button
                className="btn rounded-3 text-white fs-3 text-white me-3"
                style={{ backgroundColor: "#7c2023" }}
              >
                Reload
              </button>
              <button
                className="btn rounded-3 text-white fs-3 text-white"
                style={{ backgroundColor: "#7c2023" }}
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-100 p-5 d-flex flex-column">
        <div className="w-100 d-flex ">
          <button className="border-0 bg-transparent" onClick={back}>
            <img src={arrow} alt="" />
          </button>
          <h1 className="ms-5 display-4 fw-semibold">
            {capitalizeWords(friendUser.username)}
          </h1>
        </div>
      </div>
      <div className="" style={{ marginLeft: "10%", marginRight: "10%" }}>
        <div
          className="row row-cols-1 g-3 m-0 px-2 py-4 overflow-auto"
          style={{ maxHeight: "60vh" }}
          id="message"
        >
          {currentChats &&
            currentChats.map((c) =>
              c.to == active.userId ? (
                <div key={c.id} className="col d-flex">
                  <div className="" style={{ maxWidth: "60%" }}>
                    <div
                      className="receiver"
                      style={{ backgroundColor: c.pin == true && "yellow" }}
                    >
                      <div
                        className="m-0 p-1 text-break pb-0 fs-5 fw-lighter"
                        style={{ width: "fit-content" }}
                      >
                        {c.chat.includes("SENDPICTURE|") ? (
                          <>
                            <img
                              src={c.chat.substring(12)}
                              style={{ maxHeight: "40vh" }}
                            />
                          </>
                        ) : (
                          <p>{c.chat}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={c.id} className="col d-flex justify-content-end">
                  <div className="" style={{ maxWidth: "60%" }}>
                    <div
                      className="sender"
                      style={{ backgroundColor: c.pin == true && "yellow" }}
                    >
                      <div className="m-0 px-3 text-break py-2 fs-5 fw-lighter border-bottom border-1 border-black">
                        {c.chat.includes("SENDPICTURE|") ? (
                          <>
                            <img
                              src={c.chat.substring(12)}
                              style={{ maxHeight: "40vh" }}
                            />
                          </>
                        ) : (
                          <p>{c.chat}</p>
                        )}
                      </div>
                      <button className="w-100 p-1 fs-lighter border-0 bg-transparent text-center">
                        Unsend
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              )
            )}
        </div>
      </div>
    </>
  );
}

export default PinChat;
