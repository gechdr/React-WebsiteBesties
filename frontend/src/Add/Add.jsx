import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.png";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import DataHandler from "../DataHandler";
import { setUsers } from "../Redux/userSlice";

function Add() {
  const user = useLoaderData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.listUser);
  const [find, setFind] = useState("none");
  const { addFriend, loadUser } = DataHandler;

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const handleSearch = (data) => {
    // Search
    const result = users.find((u) => u.username == data.search);

    if (result) {
      // found
      let safe = true;
      if (result.id == user.id) {
        setFind(null);
        safe = false;
      }

      let friend = false;
      for (let i = 0; i < user.friends.length; i++) {
        const f = user.friends[i];

        if (f == result.id) {
          friend = true;
          break;
        }
      }
      if (friend == true) {
        setFind(null);
        safe = false;
      }

      if (safe == true) {
        setFind(result);
      }
    } else {
      // not found
      setFind(null);
    }
  };

  const handleAddFriend = async () => {
    const add = await addFriend(user.id, find.id);
    const tempUsers = await loadUser();
    dispatch(setUsers(tempUsers));
    navigate("/home");
  };

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
          <h1 className="ms-5 display-4 fw-semibold">Add Friend</h1>
        </div>
      </div>
      <div className="" style={{ marginLeft: "10%", marginRight: "10%" }}>
        <form onSubmit={handleSubmit(handleSearch)}>
          <label className="fs-1">Username</label>
          <br />
          <input
            className="fs-1 border-0 rounded-3 mt-2 px-3"
            type="text"
            placeholder="Username"
            {...register("search")}
          />
          <button
            className="fs-1 ms-4 rounded-3 px-3 border-0 text-white"
            style={{ backgroundColor: "#7c2023" }}
            type="submit"
          >
            Search
          </button>
        </form>
        <div className="mt-5">
          {find == null && (
            <span className="w-100 fs-4" style={{ color: "red" }}>
              No user found
            </span>
          )}
          {find != null && find != "none" && (
            <>
              <span className="w-100 fs-4">User found</span>
              <br />
              <br />
              <div className="card rounded-4 p-3">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start">
                    <div className="w-75">
                      <h1>{find.username}</h1>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end me-3 mb-3">
                  <button
                    className="fs-3 border-0 rounded-3 px-4 py-2 text-white"
                    style={{ backgroundColor: "#7c2023" }}
                    onClick={handleAddFriend}
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Add;
