import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up with", { fullName, email, password, role });
  };

  return (
    <div className="container">
      <h2>Account Signup</h2>
      <p>Become a member and enjoy exclusive promotions.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-field"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />

        {/* Password Field with Eye Icon */}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Role Selection */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant Owner</option>
        </select>

        <button type="submit" className="btn">Continue</button>
      </form>

      <p>
        Already have an account? <Link to="/" className="link">Login here</Link>
      </p>
    </div>
  );
}

export default SignupForm;
