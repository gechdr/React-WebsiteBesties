import { useLoaderData, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.png";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import $ from "jquery";

function Broadcast() {
  const user = useLoaderData();
  const navigate = useNavigate();

  const users = useSelector((state) => state.user.listUser);

  const [refresh, setRefresh] = useState(true);

  const checkValidation = (value, helpers) => {
    if (value == false) {
      return helpers.message({
        custom: "*Must be filled on at least 1 friend!",
      });
    }

    return value;
  };

  // const schema = Joi.object({
  //   newChat: Joi.string().required().messages({
  //     "string.empty": "*Cannot be Empty!",
  //   }),
  //   inputCheckBox: Joi.custom(checkValidation),
  // });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

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

  const getUsername = (id) => {
    let user = users.find((u) => u.id == id);
    return capitalizeWords(user.username);
  };

  const selectAll = () => {
    console.log("Select All");
    const inputs = document.getElementsByName("inputCheckBox");
    inputs.forEach((i) => {
      i.toggleAttribute("checked", true);
    });

    setRefresh(!refresh);
  };
  const deselectAll = () => {
    console.log("Deselect All");
    const inputs = document.getElementsByName("inputCheckBox");
    inputs.forEach((i) => {
      i.toggleAttribute("checked", false);
    });
    setRefresh(!refresh);
  };

  const handleChat = async (data) => {
    // New Chat
    // const chat = await newChat(active.userId, active.friendId, data.newChat);
    // alert("Submit!");

    if (data.inputCheckBox == false) {
      setError("inputCheckBox", {
        type: "custom",
        message: "*Atleast 1 must checked!",
      });
    }

    reset();
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
          <h1 className="ms-5 display-4 fw-semibold">Broadcast Message</h1>
        </div>

        <form
          className="d-flex w-100 flex-column"
          onSubmit={handleSubmit(handleChat)}
        >
          <div className="d-flex w-100 mt-4 p-0">
            <span className="w-100 fs-3 ms-4">Message</span>
          </div>
          <div className="d-flex w-100">
            <div className="w-100 d-flex flex-column mb-4">
              <div className="d-flex">
                <textarea
                  className="mx-4 rounded-3 w-100 p-3 fs-3"
                  style={{ resize: "none" }}
                  placeholder="Message ..."
                  {...register("newChat")}
                ></textarea>
                <div className="w-75 d-flex align-items-center">
                  <button
                    className="me-4 fs-2 px-4 border-0 rounded-3 text-white"
                    style={{ backgroundColor: "#7c2023" }}
                    type="submit"
                  >
                    Send
                  </button>
                </div>
              </div>
              <span className="ms-4 fs-5" style={{ color: "red" }}>
                {errors?.newChat?.message}
              </span>
            </div>
          </div>

          <div className="d-flex ms-4">
            <button
              className="me-4 fs-2 px-4 border-0 rounded-3 text-white"
              style={{ backgroundColor: "#7c2023" }}
              onClick={selectAll}
              // type="button"
              id="selectAll"
            >
              Select All
            </button>
            <button
              className="me-4 fs-2 px-4 border-0 rounded-3 text-white"
              style={{ backgroundColor: "#7c2023" }}
              onClick={deselectAll}
              // type="button"
              id="deselectAll"
            >
              Deselect All
            </button>
          </div>

          <div className="d-flex flex-column w-100 mt-4">
            {user &&
              user.friends.map((f, index) => (
                <div key={index} className="form-check ms-4 fs-3 ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="inputCheckBox"
                    value={f}
                    {...register("inputCheckBox")}
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label">{getUsername(f)}</label>
                </div>
              ))}
            <span className="ms-4 fs-5" style={{ color: "red" }}>
              {errors?.inputCheckBox?.message}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default Broadcast;
