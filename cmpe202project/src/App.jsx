import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import RestaurantPage from "./pages/RestaurantPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./AdminDashboard/Dashboard";
import ApproveNewRestaurant from "./AdminAddRest/ApproveNewRestaurant";
import RemoveRest from "./AdminRemoveRest/RemoveRest";
import NoPage from "./pages/NoPage";
import CustomerLayout from "./pages/CustomerLayout";
import Layout from "./pages/Layout";
import { ReservationProvider } from "./context/ReservationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import ManagerDashboard from "./Manager/ManagerDashboard";
import ManagerRestaurants from "./ManagerRest/ManagerRestaurants";
import ReservationsPage from "./pages/ReservationsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route
            path="/"
            element={
              <ReservationProvider>
                <CustomerLayout />
              </ReservationProvider>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="restaurant/:id" element={<RestaurantPage />} />
            <Route
              path="booking"
              element={
                <ProtectedRoute role="USER">
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reservations"
              element={
                <ProtectedRoute role="USER">
                  <ReservationsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth routes */}
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
          </Route>

          {/* ✅ Manager Routes */}
          <Route path="/manager" element={<Layout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute role="RESTAURANT_MANAGER">
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="restaurants"
              element={
                <ProtectedRoute role="RESTAURANT_MANAGER">
                  <ManagerRestaurants />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin routes (protected) */}
          <Route path="/admin" element={<Layout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute role="ADMIN">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="approve"
              element={
                <ProtectedRoute role="ADMIN">
                  <ApproveNewRestaurant />
                </ProtectedRoute>
              }
            />
            <Route
              path="restaurants"
              element={
                <ProtectedRoute role="ADMIN">
                  <RemoveRest />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
