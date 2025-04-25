import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "../styles/LoginSignup.css";
import { BASE_URL } from "../config/api";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const { email, accessToken, refreshToken, role } = response.data;
      const user = {
        email,
        accessToken,
        refreshToken,
        role,
      };
      // Store token and user info based on rememberMe preference
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", user.accessToken);
      storage.setItem("user", JSON.stringify(user));
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      console.log("Retrieved token:", token);
      // Set default authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Redirect logic - enhanced with email check as fallback
      if (user?.role?.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else if (user?.role?.includes("RESTAURANT_MANAGER")) {
        navigate("/manager/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials.";

      if (err.response) {
        // Handle different HTTP status codes
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.status === 403) {
          errorMessage = "Account not verified or suspended";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please try again.";
      }

      setError(errorMessage);
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h2>Account Login</h2>
        <p>
          If you are already a member, you can log in with your email and
          password.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
            autoComplete="username"
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex="-1"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-btn ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
