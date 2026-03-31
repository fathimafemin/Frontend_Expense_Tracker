import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const baseUrl = API_URL || "https://backend-expense-tracker-6.onrender.com";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      alert("Login successful ✅");
      navigate("/dashboard");
    } catch (error) {
    alert(error.response?.data?.detail || "Login failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="container">
    <div className="card">

      <h2 className="title">Login</h2>

      <label className="label">Email</label>
      <input
        className="input"
        placeholder="Type your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="label">Password</label>
      <input
        className="input"
        type="password"
        placeholder="Type your password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="button" onClick={handleLogin}disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    <p className="signup-text">
  Don't have an account?{" "}
  <span className="signup-link" onClick={() => navigate("/register")}>
    Signup
  </span>
</p>

    </div>
  </div>
);
}

export default Login;