import React from "react";
import DonorList from "./donor/donorList";
import Sidebar from "../common/sidebar";
import { Box, Container, CssBaseline, Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <Sidebar />

      <Container
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DonorList />
      </Container>
    </Box>
  );
};

export default Dashboard;
