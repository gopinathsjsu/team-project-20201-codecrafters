export default function LoginForm({ toggleForm }) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Login</h2>
        <form className="mt-4">
          <input type="email" placeholder="Email" required className="input-field" />
          <input type="password" placeholder="Password" required className="input-field" />
          <button type="submit" className="btn">Login</button>
          <p className="text-sm mt-2">
            Don't have an account?{" "}
            <span className="text-blue-600 cursor-pointer" onClick={toggleForm}>Sign Up</span>
          </p>
        </form>
      </div>
    );
  }
  