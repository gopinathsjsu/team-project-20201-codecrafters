import { Outlet, Link } from "react-router-dom";
import CustomerNavBar from "../components/CustomerNavBar";

const CustomerLayout = () => {
  return (
    <>
      <CustomerNavBar />

      <Outlet />
    </>
  );
};

export default CustomerLayout;
