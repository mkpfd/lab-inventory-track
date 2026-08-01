// tracks who's currently logged in (in state + localStorage) and sets up all the routes
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import StudentDashboard from "./pages/StudentDashboard";
import SearchChemicals from "./pages/SearchChemicals";
import OrderRequestForm from "./pages/OrderRequestForm";

import LabManagerDashboard from "./pages/LabManagerDashboard";
import ManageChemicals from "./pages/ManageChemicals";
import ReviewOrders from "./pages/ReviewOrders";

import DeptHeadDashboard from "./pages/DeptHeadDashboard";
import ViewChemicals from "./pages/ViewChemicals";
import ActivityLogPage from "./pages/ActivityLogPage";
import ManageUsers from "./pages/ManageUsers";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // stay logged in after a page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <div className="page-container">
        <Routes>
          <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* student pages */}
          <Route
            path="/student"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["student"]}>
                <StudentDashboard currentUser={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/search"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["student"]}>
                <SearchChemicals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/order"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["student"]}>
                <OrderRequestForm />
              </ProtectedRoute>
            }
          />

          {/* lab manager pages */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["labmanager"]}>
                <LabManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/chemicals"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["labmanager"]}>
                <ManageChemicals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/orders"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["labmanager"]}>
                <ReviewOrders />
              </ProtectedRoute>
            }
          />

          {/* department head pages */}
          <Route
            path="/depthead"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["depthead"]}>
                <DeptHeadDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/depthead/chemicals"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["depthead"]}>
                <ViewChemicals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/depthead/activitylog"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["depthead"]}>
                <ActivityLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/depthead/users"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={["depthead"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* default route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
