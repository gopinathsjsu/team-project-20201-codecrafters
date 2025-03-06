import { useState } from "react";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState("customer");

    return (
        <div className="container">
            {isLogin ? (
                <div className="form-container" id="login-form">
                    <h2>Login</h2>
                    <form>
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit">Login</button>
                        <p>Don't have an account? <a href="#" onClick={() => setIsLogin(false)}>Sign Up</a></p>
                    </form>
                </div>
            ) : (
                <div className="form-container" id="signup-form">
                    <h2>Sign Up</h2>
                    <form>
                        <input type="text" placeholder="Full Name" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                            <option value="customer">Customer</option>
                            <option value="restaurant">Restaurant Owner</option>
                        </select>
                        {userType === "restaurant" && (
                            <div id="restaurant-fields">
                                <input type="text" placeholder="Restaurant Name" />
                                <input type="text" placeholder="Business License Number" />
                            </div>
                        )}
                        <button type="submit">Sign Up</button>
                        <p>Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Login</a></p>
                    </form>
                </div>
            )}
        </div>
    );
}

const styles = `
    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8f8f8; margin: 0; }
    .container { background: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; width: 100%; max-width: 350px; box-sizing: border-box; }
    .form-container { text-align: center; }
    input, select, button { width: calc(100% - 20px); padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    button { background: #ff6600; color: white; border: none; cursor: pointer; }
    button:hover { background: #e65c00; }
    .hidden { display: none; }
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
