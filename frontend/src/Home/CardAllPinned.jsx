import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dot from "../assets/dot.png";
import { setActiveChat } from "../Redux/chatSlice";
import { useNavigate } from "react-router-dom";

function CardAllPined(props) {
  const users = useSelector((state) => state.user.listUser);
  const chats = useSelector((state) => state.chat.listChat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dummy, setDummy] = useState(false);

  const capitalizeWords = (word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const rest = word.slice(1).toLowerCase();

    return firstLetter + rest;
  };

  const openChat = (id) => {
    // Open Chat
    const chat = chats.find((c) => c.id == id);
    if (chat.from == props.user) {
      dispatch(setActiveChat({ friendId: chat.to, userId: props.user }));
    }
    if (chat.to == props.user) {
      dispatch(setActiveChat({ friendId: chat.from, userId: props.user }));
    }
    navigate(`/home/chat/${props.user}`);
  };

  const getUsername = (id) => {
    let user = users.find((u) => u.id == id);
    return capitalizeWords(user.username);
  };

  return (
    <>
      <div className="col">
        <div
          className="card rounded-4 p-1 m-0 p-0"
          style={{ cursor: "pointer" }}
          onClick={() => openChat(props.id)}
        >
          <div className="card-body" style={{ height: "15vh" }}>
            <div className="card-title d-flex align-items-start">
              <div className="w-100">
                <h1
                  className="fw-semibold prevent-select"
                  style={{ fontSize: "2vw" }}
                >
                  {props.from == props.user && getUsername(props.to)}
                  {props.to == props.user && getUsername(props.from)}
                </h1>
              </div>
            </div>
            <div className="w-100">
              <p
                className="fs-6 text-secondary"
                style={{
                  width: "20ch",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {props.chat}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardAllPined;
