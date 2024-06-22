/* eslint-disable react/prop-types */
import "../style.css";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import DataHandler from "../DataHandler.jsx";
import { useDispatch } from "react-redux";
import { setUsers } from "../Redux/userSlice.js";

function Register() {
  const fetcher = useFetcher();

  const { loadUser, getUser, regisUser } = DataHandler;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "*Field is Empty!",
    }),
    password: Joi.string().required().messages({
      "string.empty": "*Field is Empty!",
    }),
    confirmPassword: Joi.string().required().messages({
      "string.empty": "*Field is Empty!",
    }),
    phoneNumber: Joi.string().min(8).required().messages({
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

  const handleRegister = async (data) => {
    let userValid = await getUser(data.username);

    if (data.password != data.confirmPassword) {
      setError("confirmPassword", {
        type: "custom",
        message: "*Password not Match!",
      });
    } else if (isNaN(Number(data.phoneNumber))) {
      setError("phoneNumber", {
        type: "custom",
        message: "*Can't contains alphabets!",
      });
    } else if (userValid) {
      setError("username", {
        type: "custom",
        message: "*Username already taken!",
      });
    } else {
      let regis = await regisUser(
        data.username,
        data.password,
        data.phoneNumber
      );

      let tempUsers = await loadUser();
      dispatch(setUsers(tempUsers));

      navigate("/");
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
          <h1 className="text-black text-center pt-3 mb-5">Register</h1>
          <form onSubmit={handleSubmit(handleRegister)} className="px-3">
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
            <label htmlFor="" className="text-black fs-4">
              Confirm Password
            </label>
            <br />
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-100 rounded fs-4 border-0 px-2"
            />
            <br />
            <span className="w-100 fs-4" style={{ color: "red" }}>
              {errors?.confirmPassword?.message}
            </span>
            <br />
            <label htmlFor="" className="text-black fs-4">
              Phone Number
            </label>
            <br />
            <input
              type="text"
              {...register("phoneNumber")}
              className="w-100 rounded fs-4 border-0 px-2"
            />
            <br />
            <span className="w-100 fs-4" style={{ color: "red" }}>
              {errors?.phoneNumber?.message}
            </span>
            <br />
            <br />
            <div className="d-flex align-items-center">
              <button
                className="w-100 fs-4 py-1 rounded-3 border-0 text-white me-1"
                style={{ backgroundColor: "#7c2023" }}
                type="submit"
              >
                Register
              </button>
              <Link className="w-100" to={"/"}>
                <button
                  className="w-100 fs-4 py-1 rounded-3 border-0 text-white"
                  style={{ backgroundColor: "#7c2023" }}
                >
                  Login
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

export default Register;
