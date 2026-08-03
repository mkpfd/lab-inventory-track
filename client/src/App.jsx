// tracks who's currently logged in (in state + localStorage) and sets up all the routes
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasswordResetPage from "./pages/PasswordResetPage";

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
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div>
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} />} />
          <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute
                currentUser={currentUser}
                allowedRoles={["student", "labmanager", "depthead", "admin"]}
              >
                <PasswordResetPage onPasswordReset={handleLogout} />
              </ProtectedRoute>
            }
          />

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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
