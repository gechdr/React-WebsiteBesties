import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.png";
import { useDispatch, useSelector } from "react-redux";
import DataHandler from "../DataHandler";
import { setChats } from "../Redux/chatSlice";
import { useForm } from "react-hook-form";

function ActiveChat() {
  const users = useSelector((state) => state.user.listUser);
  const chats = useSelector((state) => state.chat.listChat);
  const active = useSelector((state) => state.chat.activeChat);
  const { getChat, getChatById, updatePin, updateStatus, deleteChat, newChat } =
    DataHandler;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tempPin, setTempPin] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
  }

  const back = () => {
    navigate("/home");
  };

  function scrollToBottom() {
    const someElement = document.getElementById("message");
    someElement.scrollTop = someElement.scrollHeight;
  }

  const capitalizeWords = (word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const rest = word.slice(1).toLowerCase();

    return firstLetter + rest;
  };

  const updateChatStatus = async () => {
    // Update Status
    const response = await updateStatus(active.userId, active.friendId);
    updateChat();
  };

  useEffect(() => {
    scrollToBottom();
    updateChatStatus();
  }, [active]);

  const updateChat = async () => {
    const response = await getChat();
    dispatch(setChats(response));
  };

  useEffect(() => {
    updateChat();
  }, [tempPin, active]);

  const tooglePin = async (id) => {
    // Toogle
    const chat = await getChatById(id);
    let pin;
    if (chat.pin == false) {
      // Pin
      pin = true;
    } else if (chat.pin == true) {
      // Unpin
      pin = false;
    }
    const response = await updatePin(id);
    setTempPin(!tempPin);
  };

  const handleDelete = async (id) => {
    // Unsend
    const chat = await deleteChat(id);
    setTempPin(!tempPin);
  };

  const handleChat = async (data) => {
    // New Chat
    const chat = await newChat(active.userId, active.friendId, data.newChat);
    reset();
    setTempPin(!tempPin);
  };

  return (
    <>
      <div className="w-100 h-100 pt-4 d-flex flex-column">
        <div className="w-100 d-flex pb-4 border-bottom border-3 border-black d-flex slign-items-center">
          <div className="w-100 d-flex align-items-center">
            <button className="border-0 bg-transparent" onClick={back}>
              <img className="w-50 h-50" src={arrow} alt="" />
            </button>
            <h1 className="ms-2">
              {friendUser && capitalizeWords(friendUser.username)}
            </h1>
          </div>
          <div className="w-100 d-flex align-items-center justify-content-end me-4">
            {active && (
              <Link to={`/home/chat/${active.userId}/pin`}>
                <button
                  className="border-0 fs-3 px-3 py-1 rounded-3 text-white"
                  style={{ backgroundColor: "#7c2023" }}
                >
                  Pinned
                </button>
              </Link>
            )}
          </div>
        </div>
        <div
          className="row row-cols-1 g-3 m-0 px-2 py-4 overflow-auto"
          style={{ maxHeight: "60vh" }}
          id="message"
          // onClick={updateChatStatus}
        >
          {currentChats &&
            currentChats.map((c) =>
              c.to == active.userId ? (
                <div key={c.id} className="col d-flex">
                  <div className="" style={{ maxWidth: "60%" }}>
                    <div
                      className="receiver"
                      style={{
                        backgroundColor: c.pin == true ? "yellow" : "#ffffff",
                      }}
                      onDoubleClick={() => tooglePin(c.id)}
                    >
                      <div
                        className="m-0 p-1 text-break pb-0 fs-5 fw-lighter"
                        style={{ width: "fit-content" }}
                      >
                        {c.chat.includes("SENDPICTURE|") ? (
                          <>
                            <img
                              src={c.chat.substring(12)}
                              style={{ maxHeight: "40vh", maxWidth: "100%" }}
                            />
                          </>
                        ) : (
                          <p className="prevent-select">{c.chat}</p>
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
                      style={{
                        backgroundColor: c.pin == true ? "yellow" : "#dcf8c6",
                      }}
                      onDoubleClick={() => tooglePin(c.id)}
                    >
                      <div className="m-0 px-3 text-break py-2 fs-5 fw-lighter border-bottom border-1 border-black">
                        {c.chat.includes("SENDPICTURE|") ? (
                          <>
                            <img
                              src={c.chat.substring(12)}
                              style={{ maxHeight: "40vh", maxWidth: "100%" }}
                            />
                          </>
                        ) : (
                          <p className="prevent-select">{c.chat}</p>
                        )}
                      </div>
                      <button
                        className="w-100 p-1 fs-lighter border-0 bg-transparent text-center"
                        onClick={() => handleDelete(c.id)}
                      >
                        Unsend
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              )
            )}
        </div>

        <form
          className="d-flex align-self-bottom border-top border-3 border-black mt-auto"
          onSubmit={handleSubmit(handleChat)}
        >
          <textarea
            className="m-4 rounded-3 w-100 p-3 fs-3"
            style={{ resize: "none" }}
            placeholder="Message ..."
            {...register("newChat")}
          ></textarea>
          <div className="d-flex align-items-center">
            <button
              className="me-4 fs-2 px-4 border-0 rounded-3 text-white"
              style={{ backgroundColor: "#7c2023" }}
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ActiveChat;
