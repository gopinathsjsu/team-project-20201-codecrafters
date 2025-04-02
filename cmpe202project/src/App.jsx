import Layout from "./pages/Layout";
import RemoveRest from "./AdminRemoveRest/RemoveRest"; // Import Dashboard
import ApproveNewRestaurant from "./AdminAddRest/ApproveNewRestauant";
import Dashboard from "./AdminDashboard/Dashboard"; // Import Dashboard
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
        <Route path="/" element={<CustomerLayout />}>
          <Route index path="/" element={<HomePage />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="dashboard" element={<Dashboard />} /> {/*Dashboard Route */}
          <Route path="dashboard" element={<ApproveNewRestaurant />} /> {/* Dashboard Route */}
          <Route path="remove-restaurant" element={<RemoveRest />} /> {/* Dashboard Route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
