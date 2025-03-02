import React from "react";
import { Box } from "@mui/material";
import { Suspense } from "react";
import RouteIndex from "./route";
import SuspenseLoader from "./components/common/suspenseLoader";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <SuspenseLoader />
          </Box>
        }
      >
        <RouteIndex />
      </Suspense>
    </>
  );
}

export default App;
