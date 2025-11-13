import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/users/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        background:
          "linear-gradient(to bottom right, #0F021B, #2C0B4F, #170529)",
      }}
    >
      <div className="w-full max-w-xs md:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-[#3e2e60] shadow-xl p-8 rounded-xl w-full"
          style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            Log In
          </h2>

          <div className="mb-4 relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#5a4a7d] border border-[#6b5a8e] text-white rounded-lg p-3 pl-10 placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-[#8e6bb3] transition duration-200"
            />
          </div>

          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#5a4a7d] border border-[#6b5a8e] text-white rounded-lg p-3 pl-10 pr-10 placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-[#8e6bb3] transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-200 transition duration-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 active:shadow-inner"
            style={{
              background: "linear-gradient(to right, #7a49b2, #a050ff)",
            }}
          >
            Log In
          </button>

          <p className="text-sm text-center mt-6 text-white/70">
            Don’t have an account?
            <Link
              to="/signup"
              className="text-[#a050ff] hover:text-[#8030df] font-medium transition duration-200"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
