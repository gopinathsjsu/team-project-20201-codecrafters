import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    const payload = {
      email,
      phone,
      password,
      roles: [role], // Now uses correct role format
    };

    console.log("Sending signup payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await axios.post(
        "http://34.27.137.104/signUp",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Signup success:", res.data);
      alert("Signup successful!");
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        console.error("Status Code:", error.response.status);
        console.error("Response Data:", error.response.data);
        alert(
          "Signup failed:\n" +
            "Status: " +
            error.response.status +
            "\n" +
            "Details: " +
            (typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data))
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Signup failed: No response from server.");
      } else {
        console.error("General Error:", error.message);
        alert("Signup failed: " + error.message);
      }
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h2>Account Signup</h2>
        <p>Become a member and enjoy exclusive promotions.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            required
          />

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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select Role</option>
            <option value="USER">Customer</option>
            <option value="RESTAURANT_MANAGER">Restaurant Owner</option>
          </select>

          <button type="submit" className="btn">
            Continue
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/" className="link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
