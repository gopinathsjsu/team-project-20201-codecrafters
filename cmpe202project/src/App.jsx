import Layout from "./pages/Layout";
import Dashboard from "./AdminDashboard/Dashboard";
import RemoveRest from "./AdminRemoveRest/RemoveRest";
import ApproveNewRestaurant from "./AdminAddRest/ApproveNewRestaurant";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CustomerLayout from "./pages/CustomerLayout";
import SearchResultsPage from "./pages/SearchResultsPage";
import NoPage from "./pages/NoPage";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReservationProvider } from "./context/ReservationContext";
import "./App.css";
import BookingPage from "./pages/BookingPage";

// 👇 Manager Imports
import ManagerDashboard from "./Manager/ManagerDashboard";
import ManagerRestaurants from "./ManagerRest/ManagerRestaurants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ReservationProvider>
              <CustomerLayout />
            </ReservationProvider>
          }
        >
          <Route index path="/" element={<HomePage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="restaurant/:name" element={<RestaurantPage />} />
          <Route path="booking" element={<BookingPage />} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />

          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/approve" element={<ApproveNewRestaurant />} />
          <Route path="admin/restaurants" element={<RemoveRest />} />

          {/* ✅ Manager Routes */}
          <Route path="manager/dashboard" element={<ManagerDashboard />} />
          <Route path="manager/restaurants" element={<ManagerRestaurants />} />
        </Route>

        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
