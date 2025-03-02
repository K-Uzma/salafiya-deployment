import React, { memo, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Sidebar from "../../common/sidebar";
import moment from "moment";
import { DonorDetailByID } from "../../../api/modules/donorModule";
import { useLocation } from "react-router-dom";
import AdminInfo from "./adminInfo";

const DonorView = () => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;

    // Copy styles from main page
    const styles = [...document.styleSheets]
      .map((sheet) => {
        try {
          return [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print</title>
          <style>${styles}</style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000); // Cleanup after printing
  };

  const location = useLocation();
  const donorId = location.state?.donorId || 0; // Get donor ID from state

  const [donorData, setDonorData] = useState({});
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [pan, setPan] = useState(Array(10).fill(""));
  const [aadhar, setAadhar] = useState(Array(12).fill(""));
  const [mobile, setMobile] = useState(Array(10).fill(""));
  const [donorName, setDonorName] = useState("");
  const [donorAddress, setDonorAddress] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response2 = await DonorDetailByID(donorId);
      setDonorData(response2);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [donorId]);

  useEffect(() => {
    if (Object.keys(donorData).length === 0) {
      setDate(moment().format("YYYY-MM-DD"));
      setPan(Array(10).fill(""));
      setAadhar(Array(12).fill(""));
      setMobile(Array(10).fill(""));
      setDonorName("");
      setDonorAddress("");
    } else {
      setDate(moment.utc(donorData?.approval_date).format("YYYY-MM-DD"));
      setPan(
        donorData?.pan_id
          ? donorData.pan_id.split("").slice(0, 10)
          : Array(10).fill("")
      );
      setAadhar(
        donorData?.aadhar_id
          ? donorData.aadhar_id.toString().slice(0, 12).split("")
          : Array(12).fill("")
      );
      setMobile(
        donorData?.mobile
          ? donorData.mobile.toString().slice(0, 10).split("")
          : Array(10).fill("")
      );
      setDonorName(donorData?.donor_name || "");
      setDonorAddress(donorData?.donor_address || "");
    }
  }, [donorData]);

  return loading ? (
    <CircularProgress size={30} sx={{ color: "#2e7d32" }} />
  ) : (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Container sx={{ flexGrow: 1 }}>
        {Object.keys(donorData).length === 0 ? (
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
              Please try again...
            </Typography>
          </Box>
        ) : (
          <>
            <Paper elevation={3} sx={{ p: 3, textAlign: "start" }}>
              <div ref={printRef}>
                {/* Reporting Person Information */}
                <AdminInfo />

                <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography>Date of approval/Notification:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={date}
                        InputLabelProps={{ shrink: true }}
                        disabled={true}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <hr />

                {/* Donor and Donations */}
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
                  Donor and Donations
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography>Unique Identification Number:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    {/* PAN */}
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={2}>
                        <Typography>PAN:</Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {pan.map((char, index) => (
                            <TextField
                              key={index}
                              value={char}
                              size="small"
                              sx={{
                                width: "30px",
                                textAlign: "center",
                                "& .MuiInputBase-input": {
                                  textAlign: "center",
                                  p: 0,
                                },
                              }}
                              inputProps={{ maxLength: 1 }}
                              disabled={true}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Aadhar */}
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Grid item xs={2}>
                        <Typography>Aadhar:</Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {aadhar.map((char, index) => (
                            <TextField
                              key={index}
                              value={char}
                              size="small"
                              sx={{
                                width: "30px",
                                textAlign: "center",
                                "& .MuiInputBase-input": {
                                  textAlign: "center",
                                  p: 0,
                                },
                              }}
                              inputProps={{ maxLength: 1 }}
                              disabled={true}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Mobile */}
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Grid item xs={2}>
                        <Typography>Mobile:</Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {mobile.map((char, index) => (
                            <TextField
                              key={index}
                              value={char}
                              size="small"
                              sx={{
                                width: "30px",
                                textAlign: "center",
                                "& .MuiInputBase-input": {
                                  textAlign: "center",
                                  p: 0,
                                },
                              }}
                              inputProps={{ maxLength: 1 }}
                              disabled={true}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography>Name of Donor:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={donorName}
                        disabled={true}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography>Address of Donor:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={5}
                        value={donorAddress}
                        disabled={true}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography>
                      I, <strong>SHOAIB MOHAMMED</strong> son of{" "}
                      <strong>TAJODDIN</strong> solemnly declare that to the
                      best of my knowledge and belief, the information given in
                      the certificate is correct and complete and is in
                      accordance with the provisions of the Income-tax Act,
                      1961. I further declare that I am making this certificate
                      in my capacity as <strong>TREASURER</strong> and I am also
                      competent to issue this certificate. I am holding
                      permanent account number <strong>ALNPG9298E</strong>.
                    </Typography>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  sx={{ mt: 3, justifyContent: "space-between" }}
                >
                  <Grid item>
                    <Typography>Date: </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>Signature:</Typography>
                  </Grid>
                </Grid>
              </div>

              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "right",
                  mt: 3,
                }}
              >
                <Button variant="contained" size="small" onClick={handlePrint}>
                  Print
                </Button>
              </Box>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default memo(DonorView);
