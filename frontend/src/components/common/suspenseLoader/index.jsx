import React, { memo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const SuspenseLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "white", // Background color
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography
        variant="h6"
        sx={{ marginTop: 2, color: "gray", fontWeight: "bold" }}
      >
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default memo(SuspenseLoader);

