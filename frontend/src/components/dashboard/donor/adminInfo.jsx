import React, { memo, useEffect, useState } from "react";
import { AdminDetailByID } from "../../../api/modules/donorModule";
import { Box, Grid, TextField, Typography } from "@mui/material";

const adminInfo = () => {
  const [adminData, setAdminData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AdminDetailByID();
      setAdminData(response);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        FORM NO. 10BE
      </Typography>

      <hr />

      <Typography variant="body2" sx={{ mb: 2 }}>
        (See rule 18AB) Certificate of donation under clause (ix) of sub-section
        (5) of section 80G and under clause (ii) to sub-section (1A) of section
        35 of the Income-tax Act, 1961 Donee
      </Typography>

      <hr />

      {/* Reporting Person Information */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
        Reporting Person Information
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Typography>PAN of the reporting person:</Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {Array.from(adminData?.pan_id || "AAUTS3299P").map(
              (char, index) => (
                <TextField
                  key={index}
                  value={char}
                  size="small"
                  sx={{
                    width: "30px",
                    height: "30px",
                    textAlign: "center",
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      p: 0,
                    },
                  }}
                  inputProps={{ maxLength: 1 }}
                  disabled
                />
              )
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Typography>Name of the reporting person:</Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>
              {adminData?.name || "Salafiya Education & Welfare Trust"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Typography>Address of the reporting person:</Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>
              {adminData?.address ||
                "365, Begum Peth, Solapur Maharashtra - 413001"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Typography>
            Order number granting approval under section 80G:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>
              {adminData?.granting_approval_section || "AAUTS3299PE20221"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(adminInfo);
