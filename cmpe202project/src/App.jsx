import Layout from "./pages/Layout";
import Dashboard from "./AdminDashboard/Dashboard";
import RemoveRest from "./AdminRemoveRest/RemoveRest";
import ApproveNewRestaurant from "./AdminAddRest/ApproveNewRestauant";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CustomerLayout from "./pages/CustomerLayout";
import AdminLayout from "./pages/AdminLayout";
import NoPage from "./pages/NoPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout/>}>
          <Route index path="/" element={<HomePage />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/approve" element={<ApproveNewRestaurant />} />
          <Route path="/admin/restaurants" element={<RemoveRest />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
