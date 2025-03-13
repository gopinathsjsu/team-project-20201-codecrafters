
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import RemoveRest from "./AdminRemoveRest/RemoveRest"; // Import Dashboard
import ApproveNewRestaurant from "./AdminAddRest/ApproveNewRestauant";
//import Dashboard from "./AdminDashboard/Dashboard"; // Import Dashboard
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="dashboard" element={<Dashboard />} /> {/* Dashboard Route */}
          <Route path="dashboard" element={<ApproveNewRestaurant />} /> {/* Dashboard Route */}
          <Route path="remove-restaurant" element={<RemoveRest />} /> {/* Dashboard Route */}
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
