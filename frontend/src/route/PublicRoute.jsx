import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("sal_cam_token");

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;