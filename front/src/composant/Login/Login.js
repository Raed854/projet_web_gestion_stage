import React, { useState } from "react";
import "./login.css";
import login from "../../assets/atb.jpg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaGoogle, FaMobileAlt } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email, 
        password,
      });

      const { message, token, role } = response.data;

      localStorage.setItem("jwt", token);
      localStorage.setItem("role", role);
      
      if (role === "admin") {
        navigate("/AdminDashboard");
      } else if (role === "encadrant") {
        navigate("/encadrant");
      } else if (role === "etudiant") {
        navigate("/etudient");
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

          <div className="social-login-wrapper">
            <button className="social-btn google-btn">
              <FaGoogle className="social-icon" />
              Google
            </button>
            <button className="social-btn mobile-btn">
              <FaMobileAlt className="social-icon" />
              Phone
            </button>
          </div>

          <div className="login-links">
            <Link to="/password" className="forgot-password-link">Forgot password?</Link>
            <Link to="/signup" className="signup-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
