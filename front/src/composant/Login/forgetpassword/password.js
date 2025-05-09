import React, { useState } from "react";
import "./password.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Demande de réinitialisation envoyée à :", email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="resetPasswordContainer">
      <div className="resetPasswordCard">
        <h2>Forgot Password</h2>
        <p>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
        
        {isSubmitted ? (
          <>
            <div className="successMessage">
              <FaCheckCircle className="successIcon" />
              Reset link sent successfully!
            </div>
            <p>
              If an account exists for {email}, you will receive a password reset link at this email address.
            </p>
            <Link to="/login" className="backToLoginLink">
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Back to login
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="inputFieldWrapper">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span>Email</span>
              <FaEnvelope className="emailIcon" />
            </div>
            <button 
              type="submit" 
              className="submitButton"
              disabled={isLoading}
            >
             {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            </button>
            <Link to="/login" className="backToLoginLink">
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
