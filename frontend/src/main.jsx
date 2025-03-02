import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import "@fontsource/roboto";
import GlobalThemeProvider from "./theme/GlobalThemeProvider";
import { HelmetProvider } from "react-helmet-async";

// If you are using react-helmet-async on server side
const helmetContext = {};

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <HelmetProvider context={helmetContext}>
    <GlobalThemeProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />

      <App />
    </GlobalThemeProvider>
  </HelmetProvider>
  // </React.StrictMode>
);
