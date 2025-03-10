import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, RoleBasedRoute } from "./ProtectedRoutes";
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AddResident />
            </RoleBasedRoute>
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
            <RoleBasedRoute allowedRoles={["admin", "owner"]}>
              <AddUser />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Messages />
            </RoleBasedRoute>
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
          path="/archive"
          element={
            <RoleBasedRoute allowedRoles={["admin", "owner"]}>
              <ArchivePage />
            </RoleBasedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
