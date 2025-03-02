import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import login_img from "../../assets/login_img.jpg";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import { loginUser } from "../../api/modules/authModule";
import CircularLoader from "../common/CircularLoader";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = username ? "" : "Username is required";
    tempErrors.password = password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const formData = { username, password };

      try {
        setLoading(true);
        const response = await loginUser(formData);
        toast.success(response.message);
        localStorage.setItem("sal_cam_token", response.token);

        axiosInstance.defaults.headers.Authorization = `Bearer ${response.token}`;

        window.location.replace("/dashboard");
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(`${error.response?.data?.error}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", overflow: "hidden" }}>
      <Grid
        container
        sx={{ height: "100vh", overflow: "hidden" }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left Side: Login Form */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: 3, // Reduce padding if needed
              width: "80%",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Salafiya Education & Welfare Trust, Admin Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />

              {loading ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "#00703C", color: "white", mt: 2 }}
                  fullWidth
                  size="large"
                  disabled={true}
                >
                  <CircularLoader />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "#00703C", color: "white", mt: 2 }}
                  fullWidth
                  size="large"
                >
                  Login
                </Button>
              )}
            </form>
          </Paper>
        </Grid>

        {/* Right Side: Image */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          <img
            src={login_img}
            loading="lazy"
            alt="Salafiya Education & Welfare Trust"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100vh",
              borderRadius: "8px",
              objectFit: "contain",
              overflow: "hidden",
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
