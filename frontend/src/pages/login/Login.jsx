import React, { useState } from "react";
import logo_big from "../../assets/logo_big.png";
import background from "../../assets/background.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  if (localStorage.getItem("token")) {
    window.location.href = "/chat";
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    setError(null); // Reset previous error

    axios
      .post(`${backendUrl}/user/login`, data)
      .then((response) => {
        console.log(response.data);

        const { token, email, _id } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("_id", _id);
        window.location.href = "/chat";
      })
      .catch((error) => {
        console.error(error);
        const errMsg =
          error?.response?.data?.message || "Login failed. Please try again.";
        setError(errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="flex flex-row justify-center items-center w-screen p-2 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Logo Section */}
      <div className="max-md:hidden flex flex-col justify-center items-center flex-1">
        <img src={logo_big} alt="logo" className="h-64 drop-shadow-lg" />
      </div>

      {/* Login Form */}
      <form
        className="flex flex-col gap-6 flex-1 justify-center items-center bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-10 max-w-md w-full mx-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Login</h2>

        <input
          type="text"
          placeholder="Email"
          {...register("email", { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <span className="text-sm text-red-500">Email is required</span>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <span className="text-sm text-red-500">Password is required</span>
        )}

        <label className="flex items-center space-x-2 w-full text-sm text-gray-700">
          <input
            type="checkbox"
            {...register("terms", { required: true })}
            className="w-4 h-4 accent-blue-600"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="text-blue-600 underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.terms && (
          <span className="text-sm text-red-500">
            You must agree before logging in
          </span>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <span className="text-sm text-gray-700">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Sign up
          </a>
        </span>

        {error && <span className="text-sm text-red-500">{error}</span>}
      </form>
    </div>
  );
};

export default Login;
