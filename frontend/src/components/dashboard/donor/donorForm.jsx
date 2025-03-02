import React, { memo, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Sidebar from "../../common/sidebar";
import moment from "moment";
import { InsertNewDonor } from "../../../api/modules/donorModule";
import { toast } from "react-toastify";
import CircularLoader from "../../common/CircularLoader";
import AdminInfo from "./adminInfo";

const DonorForm = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [pan, setPan] = useState(Array(10).fill(""));
  const [aadhar, setAadhar] = useState(Array(12).fill(""));
  const [mobile, setMobile] = useState(Array(10).fill(""));
  const [donorName, setDonorName] = useState("");
  const [donorAddress, setDonorAddress] = useState("");

  const panRefs = useRef([]);
  const aadharRefs = useRef([]);
  const mobileRefs = useRef([]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleBoxChange = (index, setFunction, length, refs) => (e) => {
    const value = e.target.value.toUpperCase();
    if (!/^[A-Z0-9]?$/.test(value)) return;

    let newValues = [
      ...(setFunction === setPan
        ? pan
        : setFunction === setAadhar
        ? aadhar
        : mobile),
    ];
    newValues[index] = value;
    setFunction(newValues);

    // Move to the next field if input is valid and not the last field
    if (value && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, setFunction, refs) => (e) => {
    if (e.key === "Backspace") {
      let newValues = [
        ...(setFunction === setPan
          ? pan
          : setFunction === setAadhar
          ? aadhar
          : mobile),
      ];
      newValues[index] = ""; // Clear the current field
      setFunction(newValues);

      // Move focus to the previous field if not the first
      if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for required fields
    if (!date) {
      toast.error("Date of approval/Notification is required");
      return;
    }

    if (pan.some((char) => char.trim() === "")) {
      toast.error("PAN is required");
      return;
    }

    if (aadhar.some((char) => char.trim() === "")) {
      toast.error("Aadhar is required");
      return;
    }

    if (!/^[0-9]{12}$/.test(aadhar.join(""))) {
      toast.error("Aadhar must be a 12-digit number");
      return;
    }

    if (mobile.some((char) => char.trim() === "")) {
      toast.error("Mobile number is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile.join(""))) {
      toast.error("Mobile number must be a 10-digit number");
      return;
    }

    if (!donorName.trim()) {
      toast.error("Name of Donor is required");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(donorName.trim())) {
      toast.error("Name of Donor must contain only alphabets and spaces");
      return;
    }

    if (!donorAddress.trim()) {
      toast.error("Address of Donor is required");
      return;
    }

    // If all validations pass, submit the form data
    const formData = {
      approval_date: date,
      pan_id: pan.join(""),
      aadhar_id: aadhar.join(""),
      mobile: mobile.join(""),
      donor_name: donorName,
      donor_address: donorAddress,
    };

    try {
      setFormLoading(true);
      const response = await InsertNewDonor(formData);
      // Reset fields
      setDate(moment().format("YYYY-MM-DD"));
      setPan(Array(10).fill(""));
      setAadhar(Array(12).fill(""));
      setMobile(Array(10).fill(""));
      setDonorName("");
      setDonorAddress("");

      panRefs.current.forEach((ref) => ref && (ref.value = ""));
      aadharRefs.current.forEach((ref) => ref && (ref.value = ""));
      mobileRefs.current.forEach((ref) => ref && (ref.value = ""));

      toast.success(response.message);
    } catch (error) {
      setFormLoading(false);
      toast.error(`${error.response?.data?.error}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />

      <Container sx={{ flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: "start" }}>          
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
                  onChange={handleDateChange}
                  onFocus={(e) => e.target.showPicker()}
                  InputLabelProps={{ shrink: true }}
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
                        inputRef={(el) => (panRefs.current[index] = el)}
                        value={char}
                        onChange={handleBoxChange(index, setPan, 10, panRefs)}
                        onKeyDown={handleKeyDown(index, setPan, panRefs)}
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
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              {/* Aadhar */}
              <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={2}>
                  <Typography>Aadhar:</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {aadhar.map((char, index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (aadharRefs.current[index] = el)}
                        value={char}
                        onChange={handleBoxChange(
                          index,
                          setAadhar,
                          12,
                          aadharRefs
                        )}
                        onKeyDown={handleKeyDown(index, setAadhar, aadharRefs)}
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
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              {/* Mobile */}
              <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={2}>
                  <Typography>Mobile:</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {mobile.map((char, index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (mobileRefs.current[index] = el)}
                        value={char}
                        onChange={handleBoxChange(
                          index,
                          setMobile,
                          10,
                          mobileRefs
                        )}
                        onKeyDown={handleKeyDown(index, setMobile, mobileRefs)}
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
                  onChange={(e) => setDonorName(e.target.value)}
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
                  onChange={(e) => setDonorAddress(e.target.value)}
                />
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "right",
              mt: 3,
            }}
          >
            {formLoading ? (
              <Button variant="contained" size="small" disabled={true}>
                <CircularLoader />
              </Button>
            ) : (
              <Button variant="contained" size="small" onClick={handleSubmit}>
                Save
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default memo(DonorForm);
