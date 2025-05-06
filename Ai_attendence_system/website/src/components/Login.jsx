import React, { useContext, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useCookies } from "react-cookie";

const Login = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();
  const { setisLogin, setisAddProgram, setauthToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); // loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login/`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const { access_token, detail, user } = response.data;

        setisLogin(true);
        setauthToken(access_token);
        setisAddProgram(true);

        // Save token and optional user data in cookies
        setCookie("authToken", access_token, {
          path: "/",
          maxAge: 3600,
        });

        toast.success(detail || "Login successful!", { position: "top-right" });

        // Optional: Save additional user info if needed
        if (user) {
          setCookie("user", JSON.stringify(user), {
            path: "/",
            maxAge: 3600,
          });
        }

        navigate("/");
      }
    } catch (error) {
      console.error("Login Failed:", error);
      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login Failed! Please try again.";

      toast.error(errMsg, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 w-full font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back</h1>
            <p className="text-gray-600">Login to the Admin Account</p>
          </div>
          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">Login</h2>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary"
                    placeholder="Enter username"
                  />
                  <FaEnvelope className="absolute right-3 text-gray-300" />
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary"
                    placeholder="Enter password"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                  </svg>
                </div>
              </div>

              <div className="!mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-cyan-300 hover:text-gray-800"
                  } focus:outline-none`}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
