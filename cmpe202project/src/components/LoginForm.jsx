import { Link } from "react-router-dom";

export default function LoginForm() {
  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login functionality not implemented yet.");
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Login</h2>
      <form onSubmit={handleLogin} className="mt-4">
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
          Login
        </button>
        <p className="text-sm mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 cursor-pointer">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
