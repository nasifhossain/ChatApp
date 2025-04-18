import React from "react";
import logo_big from "../../assets/logo_big.png";
import background from "../../assets/background.png";
import { useForm } from "react-hook-form";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    axios.post(`${backendUrl}/user/signup`, data)
    .then((res) => {
      console.log(res);
      navigate('/login');
    })
    .catch((err) => {
      console.log(err);
    })
  };

  return (
    <div
      className="flex flex-row justify-center items-center max-w-screen min-h-screen  bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Logo Section */}
      <div className="max-md:hidden flex flex-col justify-center items-center flex-1">
        <img src={logo_big} alt="logo" className="h-64 drop-shadow-lg" />
      </div>

      {/* Login Form */}
      <form
        className="flex flex-col gap-3 flex-1 justify-center items-center bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-10 max-w-md my-10 mx-8 h-[90%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Register</h2>

        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <span className="text-sm text-red-500">Name is required</span>
        )}
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.username && (
          <span className="text-sm text-red-500">Username is required</span>
        )}
        <input
          type="tel"
          placeholder="Phone Number"
          {...register("phone", { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && (
          <span className="text-sm text-red-500">Phone Number is required</span>
        )}
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <span className="text-sm text-red-500">Email is required</span>
        )}
        <label className="w-full">
          <select
            {...register("gender", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-sm text-red-500">Gender is required</span>
          )}
        </label>

        <input
          type="date"
          placeholder="Date of Birth    "
          {...register("date", { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.date && (
          <span className="text-sm text-red-500">Date of Birth is required</span>
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

        {/* Terms Agreement */}
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
          Register
        </button>
        <span className="text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </span>
      </form>
    </div>
  );
};

  export default Register;
