import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NormalizeURL = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname } = location;
    if (pathname.endsWith("/") && pathname !== "/") {
      navigate(pathname.slice(0, -1), { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default NormalizeURL;
