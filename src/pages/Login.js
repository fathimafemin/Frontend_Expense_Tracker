import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      navigate("/dashboard");
    } catch (err) {
      alert("Incorrect Credentials");
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

      <button className="button" onClick={handleLogin}>
        Login
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