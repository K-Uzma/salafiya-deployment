import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { jwtDecode } from "jwt-decode";
import NormalizeURL from "../components/NormalizeURL";

//-------------------Admin Panel--------------------//
const Login = lazy(() => import("../components/login"));
const Dashboard = lazy(() => import("../components/dashboard"));
const DonorForm = lazy(() => import("../components/dashboard/donor/donorForm"));
const DonorView = lazy(() => import("../components/dashboard/donor/donorView"));

const RouteIndex = () => {
  const token = localStorage.getItem("sal_cam_token");
  const [decodedToken, setDecodedToken] = useState(null);
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {}
    }
  }, [token, decodedToken?.type]);

  return (
    <>
      <Router>
        <NormalizeURL />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Login />} />

          <Route path="/" element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/" element={<PrivateRoute />}>
            {decodedToken?.type === "sal_cam_admin" && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-donor" element={<DonorForm />} />
                <Route path="/view-donor" element={<DonorView />} />
              </>
            )}
          </Route>

          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
};

export default RouteIndex;
