/* eslint-disable react/prop-types */
import "../style.css";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { Link, redirect, useNavigate } from "react-router-dom";
import DataHandler from "../DataHandler";

function Login() {
  const { getUser, getToken } = DataHandler;
  const navigate = useNavigate();

  const schema = Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "*Field is Empty!",
    }),
    password: Joi.string().required().messages({
      "string.empty": "*Field is Empty!",
    }),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const handleLogin = async (data) => {
    // Login
    let user = await getUser(data.username);

    if (user) {
      // Login
      if (user.password != data.password) {
        // Wrong Password
        setError("password", {
          type: "custom",
          message: "*Wrong Password!",
        });
      } else {
        // Login
        let token = await getToken(user.id);
        localStorage.setItem("loggedData", token);

        navigate("/home");
      }
    } else {
      // Error Username
      setError("username", {
        type: "custom",
        message: "*Username not Found!",
      });
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="glass-container w-25 h-25"
          style={{ minWidth: "450px", minHeight: "450px" }}
        >
          <h1 className="text-black text-center pt-3 mb-5">LOGIN</h1>
          <form onSubmit={handleSubmit(handleLogin)} className="px-3">
            <label htmlFor="" className="text-black fs-4">
              Username
            </label>
            <br />
            <input
              type="text"
              {...register("username")}
              className="w-100 rounded fs-4 border-0 px-2"
              autoComplete="off"
            />
            <br />
            <span className="w-100 fs-4" style={{ color: "red" }}>
              {errors?.username?.message}
            </span>
            <br />
            <label htmlFor="" className="text-black fs-4">
              Password
            </label>
            <br />
            <input
              type="password"
              {...register("password")}
              className="w-100 rounded fs-4 border-0 px-2"
            />
            <br />
            <span className="w-100 fs-4" style={{ color: "red" }}>
              {errors?.password?.message}
            </span>
            <br />
            <br />
            <div className="d-flex align-items-center">
              <button
                className="w-100 fs-4 py-1 rounded-3 border-0 text-white me-1"
                style={{ backgroundColor: "#7c2023" }}
                type="submit"
              >
                Login
              </button>
              <Link className="w-100" to={"/register"}>
                <button
                  className="w-100 fs-4 py-1 rounded-3 border-0 text-white"
                  style={{ backgroundColor: "#7c2023" }}
                >
                  Register
                </button>
              </Link>
            </div>
            <br />
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
