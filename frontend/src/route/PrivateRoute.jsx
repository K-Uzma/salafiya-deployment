import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("sal_cam_token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;