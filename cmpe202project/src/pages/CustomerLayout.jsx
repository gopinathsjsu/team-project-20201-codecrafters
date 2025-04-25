import { Outlet } from "react-router-dom";
import CustomerNavBar from "../components/CustomerNavBar";
import { AuthProvider } from "../context/AuthContext";

const CustomerLayout = () => {
  return (
    <AuthProvider>
      <CustomerNavBar />
      <Outlet />
    </AuthProvider>
  );
};

export default CustomerLayout;
