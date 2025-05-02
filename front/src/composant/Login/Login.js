import React, { useState } from "react";
import "./login.css";
import login from "../../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaGoogle, FaMobileAlt } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email, // Changed from username to email
        password,
      });

      const { message, token,role } = response.data;

      // Store the JWT in localStorage or a cookie
      localStorage.setItem("jwt", token);
      localStorage.setItem("role", role);
      // Navigate to the home page
      if(role === "admin") {
        navigate("/AdminDashboard");
      }else if(role === "encadrant") {
        navigate("/encadrant");
      }
      else if(role === "etudiant") {
        navigate("/etudient");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="loginContainer">
      <div className="imageContainer">
        <img src={login} alt="" className="loginImage" />
      </div>
      <div className="formContainer">
        <div className="containerLogin">
          <div className="carde">
            <a className="login">Log in</a>
            <div className="inputBox">
              <input
                type="text"
                required="required"
                value={email} // Changed from username to email
                onChange={(e) => setEmail(e.target.value)} // Changed from setUsername to setEmail
              />
              <span className="user">Email</span>
            </div>
            <div className="inputBox">
              <input
                type="password"
                required="required"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span>Password</span>
            </div>
            <button className="enter" onClick={handleLogin}>
              Enter
            </button>
                          <div className="socialLogin">
                <button className="socialButton google">
                  <FaGoogle className="icon" />
                   Google
                </button>
                <button className="socialButton mobile">
                  <FaMobileAlt className="icon" />
                  Phone
                </button>
              </div>

            <div className="loginLinks">
            <Link to="/password" className="link">Forgot password</Link>

            <Link to="/signup" className="link">signup</Link>
              </div>    
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
