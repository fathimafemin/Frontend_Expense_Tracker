import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Register() {
  const API_URL = import.meta.env.VITE_API_URL;
  const baseUrl = API_URL || "https://backend-expense-tracker-6.onrender.com";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      
      await axios.post(`${baseUrl}/register`, {
        email,
        password,
      });

      alert("Registered successfully");
      navigate("/");
    }
   catch (error) {
    console.log("FULL ERROR:", error);

    if (error.response) {
      console.log(error.response.data);
      alert(error.response.data.detail || "Registration failed");
    } else {
      alert("Server not reachable / Network error");
    }
    alert(error.response.data.detail); //show backend message
}
     
  };

  return (
  <div className="container">
    <div className="card">

      <h2 className="title">Signup</h2>

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

      <button className="button" onClick={handleRegister}>
        Signup
      </button>
    </div>
  </div>
);
}

export default Register;