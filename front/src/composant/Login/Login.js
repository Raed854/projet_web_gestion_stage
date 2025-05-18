import React, { useState } from "react";
import "./login.css";
import login from "../../assets/atb.jpg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaGoogle, FaMobileAlt } from "react-icons/fa";
import api from "../../api";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("users/login", {
        email, 
        password,
      });

      const { message, token, role,id } = response.data;

      localStorage.setItem("jwt", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);
        if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "encadrant") {
        navigate("/encadrant/stage");
      } else if (role === "etudiant") {
        navigate("/etudiant/stages");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="image-wrapper">
        <img src={login} alt="login" className="login-image" />
      </div>
      <div className="form-wrapper">
        <div className="login-card">
          <a className="login-heading">Log in</a>
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <span className="input-label">Email</span>
          </div>
          <div className="input-group">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <span className="input-label">Password</span>
          </div>
          <button className="submit-btn" onClick={handleLogin}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
