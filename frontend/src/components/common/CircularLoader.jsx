import React, { memo } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const CircularLoader = ({ size = 20 }) => {
  return <CircularProgress size={size} sx={{ color: "#FFFFFF" }} />;
};

export default memo(CircularLoader);
