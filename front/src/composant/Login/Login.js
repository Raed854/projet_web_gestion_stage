import React, { useState } from "react";
import "./login.css";
import login from "../../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaGoogle, FaMobileAlt } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
 
    console.log("Login désactivé - aucune authentification réelle.");
    
   
    navigate("/home");
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
