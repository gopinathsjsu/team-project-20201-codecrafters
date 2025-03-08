import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignupForm() {
  const [userType, setUserType] = useState("customer");

  const handleSignUp = (e) => {
    e.preventDefault();
    alert("SignUp functionality not implemented yet.");
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Sign Up</h2>
      <form onSubmit={handleSignUp} className="mt-4">
        <input
          type="text"
          placeholder="Full Name"
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="input-field"
        />
        <button type="submit" className="btn">
          Sign Up
        </button>
        <select
          className="input-field"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant Owner</option>
        </select>
        {userType === "restaurant" && (
          <div>
            <input
              type="text"
              placeholder="Restaurant Name"
              className="input-field"
            />
            <input
              type="text"
              placeholder="Business License Number"
              className="input-field"
            />
          </div>
        )}
        <p className="text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 cursor-pointer">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
