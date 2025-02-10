import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AddResident from "./AddResident";
import ResidentList from "./ResidentList";
import AddUser from "./AddUser";
import "./index.css";
import Messages from "./Messages";
import ViewProfile from "./ViewProfile";
import ResidentDetails from "./ResidentDetails";
import ForgotPassword from "./ForgotPassword";
import ArchivePage from "./ArchivePage";

// Simple auth check - you might want to replace this with your actual auth logic
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-resident"
          element={
            <ProtectedRoute>
              <AddResident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/residents-list"
          element={
            <ProtectedRoute>
              <ResidentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-profile"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/residents/:id"
          element={
            <ProtectedRoute>
              <ResidentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
         <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <ArchivePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
