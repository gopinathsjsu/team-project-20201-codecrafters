import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("customer");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? "Welcome Back" : "Create an Account"}</h2>
        {isLogin ? (
          <LoginForm toggleForm={() => setIsLogin(false)} />
        ) : (
          <SignupForm toggleForm={() => setIsLogin(true)} userType={userType} setUserType={setUserType} />
        )}
      </div>
    </div>
  );
}
