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
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  IconButton,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../../common/sidebar";
import {
  DonorDetailByID,
  EditDonorByID,
} from "../../../api/modules/donorModule";
import { useLocation, useNavigate } from "react-router-dom";
import AdminInfo from "./adminInfo";
import { toast } from "react-toastify";
import { Close, Edit } from "@mui/icons-material";

const DonorView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isPrinting = window.matchMedia("print").matches;
  const donorId = location.state?.donorId || 0; // Get donor ID from state
  const [isPrintPage, setIsPrintPage] = useState(false);

  const printRef = useRef();

  const handlePrintPage = () => {
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
      setIsPrintPage(false);
      document.body.removeChild(iframe);
    }, 1000); // Cleanup after printing
  };

  const handlePrint = () => {
    setIsEditing(false);
    if (isMobile) {
      navigate("/print-donor", {
        state: { donorId: location.state?.donorId || 0 },
      });
    } else {
      // handlePrintPage();
      setIsPrintPage(true);
    }
  };

  useEffect(() => {
    if (isPrintPage) {
      handlePrintPage();
    }
  }, [isPrintPage]);

  const currentYear = new Date().getFullYear();
  const financialYears = Array.from(
    { length: currentYear - 1990 + 1 },
    (_, i) => {
      const startYear = currentYear - i;
      return `${startYear}-${startYear + 1}`;
    }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [donorData, setDonorData] = useState({});
  const [loading, setLoading] = useState(false);
  // const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [date, setDate] = useState("2022-12-08");
  const [pan, setPan] = useState(Array(10).fill(""));
  const [aadhar, setAadhar] = useState(Array(12).fill(""));
  const [mobile, setMobile] = useState(Array(10).fill(""));
  const [donorName, setDonorName] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [typeDonation, setTypeDonation] = useState({
    corpus: false,
    specificGrants: false,
    others: false,
  });
  const [deductionSection, setDeductionSection] = useState({
    section80G: false,
    section35_1_ii: false,
    section35_1_iia: false,
    section35_1_iii: false,
  });

  const panRefs = useRef([]);
  const aadharRefs = useRef([]);
  const mobileRefs = useRef([]);

  const [aadharErrors, setAadharErrors] = useState(Array(12).fill(""));
  const [mobileErrors, setMobileErrors] = useState(Array(10).fill(""));
  const [panErrors, setPanErrors] = useState(Array(10).fill(""));

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
      setDate("2022-12-08");
      setPan(Array(10).fill(""));
      setAadhar(Array(12).fill(""));
      setMobile(Array(10).fill(""));
      setDonorName("");
      setDonorAddress("");
      setAmountReceived("");
      setFinancialYear("");
      setTypeDonation({
        corpus: false,
        specificGrants: false,
        others: false,
      });
      setDeductionSection({
        section80G: false,
        section35_1_ii: false,
        section35_1_iia: false,
        section35_1_iii: false,
      });
    } else {
      setDate("2022-12-08");
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
      setAmountReceived(donorData?.donation_received || "");
      setFinancialYear(donorData?.financial_year || "");
      const typeDonation = donorData.donation_type
        ? donorData.donation_type.split(",").reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {})
        : {};
      setTypeDonation(typeDonation);
      const deductionSection = donorData.donation_section
        ? donorData.donation_section.split(",").reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {})
        : {};
      setDeductionSection(deductionSection);
    }
  }, [donorData]);

  const handleToggleEdit = () => {
    if (isEditing) {
      //When clicked on close icon button
      fetchData();
    }
    setIsEditing((prev) => !prev);
  };

  const handleBoxChange =
    (index, setFunction, length, refs, setErrorFunction, type) => (e) => {
      const value = e.target.value.toUpperCase();

      // Define validation rule:
      // - PAN should allow alphanumeric characters
      // - Aadhar & Mobile should allow only numbers
      const isValid =
        type === "numeric" ? /^[0-9]?$/.test(value) : /^[A-Z0-9]?$/.test(value); // Alphanumeric for PAN

      // Get current values based on function
      let newValues = [
        ...(setFunction === setPan
          ? pan
          : setFunction === setAadhar
          ? aadhar
          : mobile),
      ];

      let newErrors = [
        ...(setErrorFunction === setAadharErrors
          ? aadharErrors
          : setFunction === setPan
          ? panErrors
          : mobileErrors),
      ];

      if (!isValid) {
        newErrors[index] = "Invalid";
      } else {
        newErrors[index] = "";
      }

      setErrorFunction(newErrors);

      if (isValid) {
        newValues[index] = value;
        setFunction(newValues);

        // Move to the next field if input is valid and not the last field
        if (value && index < length - 1) {
          refs.current[index + 1]?.focus();
        }
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

    if (!amountReceived.trim()) {
      toast.error("Amount of Donation Received is required");
      return;
    }

    if (!/^\d{1,3}(,\d{2,3})*(\/-)?$|^\d+(\/-)?$/.test(amountReceived.trim())) {
      toast.error("Amount must be a valid number (e.g., 25,000/- or 2000)");
      return;
    }

    if (!financialYear) {
      toast.error("Financial Year is required");
      return;
    }

    if (
      !typeDonation.corpus &&
      !typeDonation.specificGrants &&
      !typeDonation.others
    ) {
      toast.error("At least one Type of Donation must be selected");
      return;
    }

    if (
      !deductionSection.section80G &&
      !deductionSection.section35_1_ii &&
      !deductionSection.section35_1_iia &&
      !deductionSection.section35_1_iii
    ) {
      toast.error("At least one Donation Deduction Section must be selected");
      return;
    }

    // If all validations pass, submit the form data
    const formData = {
      donorId: donorId || 0,
      pan_id: pan.join(""),
      aadhar_id: aadhar.join(""),
      mobile: mobile.join(""),
      donor_name: donorName,
      donor_address: donorAddress,
      donation_received: amountReceived,
      financial_year: financialYear,
      donation_type: Object.keys(typeDonation)
        .filter((key) => typeDonation[key])
        .join(","),

      donation_section: Object.keys(deductionSection)
        .filter((key) => deductionSection[key])
        .join(","),
    };

    try {
      setFormLoading(true);
      const response = await EditDonorByID(formData);

      setIsEditing(false);
      fetchData();

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

  return loading ? (
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
      <CircularProgress size={30} sx={{ color: "#2e7d32" }} />
    </Box>
  ) : (
    <Box sx={{ display: "flex" }}>
      {!isPrinting ? <CssBaseline /> : null}
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
            <Paper elevation={3} sx={{ p: 2, textAlign: "start" }}>
              <div ref={printRef}>
                <Box
                  sx={{
                    border: "1px solid black", // Border styling
                    borderRadius: "5px",
                    padding: "15px",
                    maxWidth: "100%", // Adjust width as needed
                    margin: "auto", // Centering horizontally
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Reporting Person Information */}
                  <AdminInfo />

                  <Grid
                    container
                    spacing={1}
                    sx={{ mt: 0.1, mb: 1, fontSize: "10px !important" }}
                  >
                    <Grid item xs={12} sm={4}>
                      <Typography>Date of approval/Notification:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {date}
                        </Typography>
                        {/* <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={date}
                        InputLabelProps={{ shrink: true }}
                        disabled={true}
                      /> */}
                      </Box>
                    </Grid>
                  </Grid>

                  <hr />

                  {/* Donor and Donations */}
                  {isPrinting ? (
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mt: 0.2, fontSize: "16px" }}
                    >
                      Donor and Donations
                    </Typography>
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mt: 0.2, fontSize: "16px" }}
                      >
                        Donor and Donations
                      </Typography>
                      {!isPrintPage && (
                        <Tooltip
                          title={isEditing ? "Cancel Edit" : "Edit Donor"}
                        >
                          <IconButton
                            onClick={handleToggleEdit}
                            sx={{
                              backgroundColor: isEditing
                                ? "#F44336"
                                : "#4CAF50",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: isEditing
                                  ? "#D32F2F"
                                  : "#388E3C",
                              },
                            }}
                          >
                            {isEditing ? <Close /> : <Edit />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}

                  <Grid container spacing={1} sx={{ mt: 0.1 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Unique Identification Number:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {/* PAN */}
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Typography>PAN:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          {!isPrinting && isEditing ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {pan.map((char, index) => (
                                <TextField
                                  key={index}
                                  inputRef={(el) =>
                                    (panRefs.current[index] = el)
                                  }
                                  value={char}
                                  onChange={handleBoxChange(
                                    index,
                                    setPan,
                                    10,
                                    panRefs,
                                    setPanErrors,
                                    "alphanumeric"
                                  )}
                                  onKeyDown={handleKeyDown(
                                    index,
                                    setPan,
                                    panRefs
                                  )}
                                  size="small"
                                  sx={{
                                    width: { xs: "8%", sm: "30px" },
                                    minWidth: "25px",
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
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {pan.map((char, index) => (
                                <TextField
                                  key={index}
                                  value={char}
                                  size="small"
                                  sx={{
                                    width: { xs: "5%", sm: "20px" },
                                    minWidth: "20px",
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
                          )}
                        </Grid>
                      </Grid>

                      {/* Aadhar */}
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 0.2 }}
                      >
                        <Grid item xs={12} sm={2}>
                          <Typography>Aadhar:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          {!isPrinting && isEditing ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {aadhar.map((char, index) => (
                                <TextField
                                  key={index}
                                  inputRef={(el) =>
                                    (aadharRefs.current[index] = el)
                                  }
                                  value={char}
                                  onChange={handleBoxChange(
                                    index,
                                    setAadhar,
                                    12,
                                    aadharRefs,
                                    setAadharErrors,
                                    "numeric"
                                  )}
                                  onKeyDown={handleKeyDown(
                                    index,
                                    setAadhar,
                                    aadharRefs
                                  )}
                                  size="small"
                                  sx={{
                                    width: { xs: "7%", sm: "30px" },
                                    minWidth: "25px",
                                    textAlign: "center",
                                    "& .MuiInputBase-input": {
                                      textAlign: "center",
                                      p: 0,
                                    },
                                  }}
                                  inputProps={{
                                    maxLength: 1,
                                    inputMode: "numeric", // Ensures numeric keyboard stays
                                    pattern: "[0-9]*", // Enforces numeric input
                                  }}
                                  error={!!aadharErrors[index]}
                                  helperText={aadharErrors[index]}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {aadhar.map((char, index) => (
                                <TextField
                                  key={index}
                                  value={char}
                                  size="small"
                                  sx={{
                                    width: { xs: "5%", sm: "20px" },
                                    minWidth: "20px",
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
                          )}
                        </Grid>
                      </Grid>

                      {/* Mobile */}
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 0.2 }}
                      >
                        <Grid item xs={12} sm={2}>
                          <Typography>Mobile:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          {!isPrinting && isEditing ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {mobile.map((char, index) => (
                                <TextField
                                  key={index}
                                  inputRef={(el) =>
                                    (mobileRefs.current[index] = el)
                                  }
                                  value={char}
                                  onChange={handleBoxChange(
                                    index,
                                    setMobile,
                                    10,
                                    mobileRefs,
                                    setMobileErrors,
                                    "numeric"
                                  )}
                                  onKeyDown={handleKeyDown(
                                    index,
                                    setMobile,
                                    mobileRefs
                                  )}
                                  size="small"
                                  sx={{
                                    width: { xs: "9%", sm: "30px" },
                                    minWidth: "25px",
                                    textAlign: "center",
                                    "& .MuiInputBase-input": {
                                      textAlign: "center",
                                      p: 0,
                                    },
                                  }}
                                  inputProps={{
                                    maxLength: 1,
                                    inputMode: "numeric", // Ensures numeric keyboard stays
                                    pattern: "[0-9]*", // Enforces numeric input
                                  }}
                                  error={!!mobileErrors[index]}
                                  helperText={mobileErrors[index]}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {mobile.map((char, index) => (
                                <TextField
                                  key={index}
                                  value={char}
                                  size="small"
                                  sx={{
                                    width: { xs: "5%", sm: "20px" },
                                    minWidth: "20px",
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
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} sx={{ mt: 0.1 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Name of Donor:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {!isPrinting && isEditing ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex" }}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {donorName}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} sx={{ mt: 0.1 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Address of Donor:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {!isPrinting && isEditing ? (
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
                      ) : (
                        <Box sx={{ display: "flex" }}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {donorAddress}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} sx={{ mt: 0.1 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Amount of Donation Received:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {!isPrinting && isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={amountReceived}
                          onChange={(e) => setAmountReceived(e.target.value)}
                        />
                      ) : (
                        <Typography sx={{ fontWeight: "bold" }}>
                          {amountReceived}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} sx={{ mt: 0.1 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Financial Year:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {!isPrinting && isEditing ? (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={financialYear}
                          onChange={(e) => setFinancialYear(e.target.value)}
                        >
                          {financialYears.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Typography sx={{ fontWeight: "bold" }}>
                          {financialYear}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={0.2} sx={{ mt: 0.1 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Type of Donation:</Typography>
                    </Grid>
                    {!isPrinting && isEditing ? (
                      <Grid item xs={12} sm={8}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={typeDonation.corpus}
                              onChange={(e) =>
                                setTypeDonation({
                                  ...typeDonation,
                                  corpus: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Corpus"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={typeDonation.specificGrants}
                              onChange={(e) =>
                                setTypeDonation({
                                  ...typeDonation,
                                  specificGrants: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Specific Grants"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={typeDonation.others}
                              onChange={(e) =>
                                setTypeDonation({
                                  ...typeDonation,
                                  others: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Others"
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={8}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={typeDonation.corpus}
                              disabled={true}
                            />
                          }
                          label="Corpus"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={typeDonation.specificGrants}
                              disabled={true}
                            />
                          }
                          label="Specific Grants"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={typeDonation.others}
                              disabled={true}
                            />
                          }
                          label="Others"
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Section Eligible for Deduction:</Typography>
                    </Grid>
                    {!isPrinting && isEditing ? (
                      <Grid item xs={12} sm={8}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section80G}
                              onChange={(e) =>
                                setDeductionSection({
                                  ...deductionSection,
                                  section80G: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Section 80G(5)(vi)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section35_1_ii}
                              onChange={(e) =>
                                setDeductionSection({
                                  ...deductionSection,
                                  section35_1_ii: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Section 35(1)(ii)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section35_1_iia}
                              onChange={(e) =>
                                setDeductionSection({
                                  ...deductionSection,
                                  section35_1_iia: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Section 35(1)(iia)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section35_1_iii}
                              onChange={(e) =>
                                setDeductionSection({
                                  ...deductionSection,
                                  section35_1_iii: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Section 35(1)(iii)"
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={8}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section80G}
                              disabled={true}
                            />
                          }
                          label="Section 80G(5)(vi)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section35_1_ii}
                              disabled={true}
                            />
                          }
                          label="Section 35(1)(ii)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section35_1_iia}
                              disabled={true}
                            />
                          }
                          label="Section 35(1)(iia)"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={deductionSection.section35_1_iii}
                              disabled={true}
                            />
                          }
                          label="Section 35(1)(iii)"
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Grid container spacing={0.3} sx={{ mt: 0.3 }}>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: "10px" }}>
                        I, <strong>SHOAIB MOHAMMED</strong> son of{" "}
                        <strong>TAJODDIN</strong> solemnly declare that to the
                        best of my knowledge and belief, the information given
                        in the certificate is correct and complete and is in
                        accordance with the provisions of the Income-tax Act,
                        1961. I further declare that I am making this
                        certificate in my capacity as <strong>TREASURER</strong>{" "}
                        and I am also competent to issue this certificate. I am
                        holding permanent account number{" "}
                        <strong>ALNPG9298E</strong>.
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    sx={{
                      mt: 2,
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid item>
                      <Typography sx={{ fontSize: "10px" }}>Date: </Typography>
                    </Grid>
                    <Grid item sx={{ pr: 25 }}>
                      <Typography sx={{ fontSize: "10px" }}>
                        Signature:
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </div>

              {!isPrinting ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "right",
                    mt: 3,
                  }}
                >
                  {isEditing ? (
                    <>
                      {formLoading ? (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={true}
                        >
                          <CircularLoader />
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSubmit}
                        >
                          Save Changes
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handlePrint}
                    >
                      Print
                    </Button>
                  )}
                </Box>
              ) : null}
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default memo(DonorView);
