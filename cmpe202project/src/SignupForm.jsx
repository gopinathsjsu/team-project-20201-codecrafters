export default function SignupForm({ toggleForm, userType, setUserType }) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Sign Up</h2>
      <form className="mt-4">
        <input type="text" placeholder="Full Name" required className="input-field" />
        <input type="email" placeholder="Email" required className="input-field" />
        <input type="password" placeholder="Password" required className="input-field" />
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
            <input type="text" placeholder="Restaurant Name" className="input-field" />
            <input type="text" placeholder="Business License Number" className="input-field" />
          </div>
        )}
        <button type="submit" className="btn">Sign Up</button>
        <p className="text-sm mt-2">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={toggleForm}>Login</span>
        </p>
      </form>
    </div>
  );
}
