import React, { useState } from "react";
import "./password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demande de réinitialisation envoyée à :", email);
    alert("Si cet email est valide, un lien vous sera envoyé.");
  };

  return (
    <div className="forgotContainers">
      <div className="forgotCards">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputBoxs">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </div>
          <button type="submit" className="sends">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
