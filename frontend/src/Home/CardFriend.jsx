import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dot from "../assets/dot.png";
import { setActiveChat } from "../Redux/chatSlice";
import { useNavigate } from "react-router-dom";

function CardFriend({ id, userLogin }) {
  const users = useSelector((state) => state.user.listUser);
  const chats = useSelector((state) => state.chat.listChat);
  const [user, setUser] = useState();
  const [lastChat, setLastChat] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dummy, setDummy] = useState(false);

  const capitalizeWords = (word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const rest = word.slice(1).toLowerCase();

    return firstLetter + rest;
  };

  useEffect(() => {
    setDummy(!dummy);

    const tempUser = users.find((u) => u.id == id);
    setUser(tempUser);

    let userChats = chats.filter(
      (c) => c.from == userLogin.id || c.to == userLogin.id
    );
    const currentChats = userChats.filter((c) => c.from == id || c.to == id);
    const tempLast = currentChats[currentChats.length - 1];
    setLastChat(tempLast);
  }, [chats, id]);

  const openChat = () => {
    // Open Chat
    dispatch(setActiveChat({ friendId: id, userId: userLogin.id }));
    navigate(`/home/chat/${userLogin.id}`);
  };

  return (
    <>
      {user && (
        <div className="col">
          <div
            className="card rounded-4 p-1 m-0 p-0"
            style={{ cursor: "pointer" }}
            onClick={openChat}
          >
            <div className="card-body" style={{ height: "15vh" }}>
              <div className="card-title d-flex align-items-start">
                <div className="w-75">
                  <h1
                    className="fw-semibold prevent-select"
                    style={{ fontSize: "2vw" }}
                  >
                    {capitalizeWords(user.username)}
                  </h1>
                </div>
                <div className="w-25 h-100 d-flex justify-content-end">
                  {lastChat &&
                    lastChat.status == "unread" &&
                    lastChat.to == userLogin.id && (
                      <>
                        <img src={dot} alt="" />
                      </>
                    )}
                </div>
              </div>
              <div className="w-100">
                {lastChat &&
                Number(lastChat.to) == Number(userLogin.id) &&
                lastChat.status == "unread" ? (
                  <p
                    className="fs-6 fw-bold"
                    style={{
                      width: "20ch",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {lastChat.chat.includes("SENDPICTURE|")
                      ? "Image"
                      : lastChat.chat}
                  </p>
                ) : lastChat ? (
                  <p
                    className="fs-6 text-secondary"
                    style={{
                      width: "20ch",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {lastChat.chat.includes("SENDPICTURE|")
                      ? "Image"
                      : lastChat.chat}
                  </p>
                ) : (
                  <br />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardFriend;
