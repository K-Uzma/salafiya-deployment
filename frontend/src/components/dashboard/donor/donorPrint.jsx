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
} from "@mui/material";
import { DonorDetailByID } from "../../../api/modules/donorModule";
import { useLocation, useNavigate } from "react-router-dom";
import AdminInfo from "./adminInfo";

const DonorPrint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const printRef = useRef();

  const donorId = location.state?.donorId || 0; // Get donor ID from state

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

  useEffect(() => {
    if (Object.keys(donorData).length !== 0) {
      alert(`print page`);
      // Print the page
      window.print();

      setTimeout(() => {
        navigate(-1); // Navigate back
      }, 700); // Adjust the timeout if needed
    }
  }, [donorName, donorAddress, amountReceived, financialYear]);

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, textAlign: "start" }}>
        <div id="print-content">
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

            <Grid container spacing={1} sx={{ mt: 0.2, mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography>Date of approval/Notification:</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography sx={{ fontWeight: "bold" }}>{date}</Typography>
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
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mt: 0.2, fontSize: "16px" }}
            >
              Donor and Donations
            </Typography>

            <Grid container spacing={1} sx={{ mt: 0.2 }}>
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
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {pan.map((char, index) => (
                        <TextField
                          key={index}
                          value={char}
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
                  sx={{ mt: 0.2 }}
                >
                  <Grid item xs={12} sm={2}>
                    <Typography>Aadhar:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {aadhar.map((char, index) => (
                        <TextField
                          key={index}
                          value={char}
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
                  sx={{ mt: 0.2 }}
                >
                  <Grid item xs={12} sm={2}>
                    <Typography>Mobile:</Typography>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {mobile.map((char, index) => (
                        <TextField
                          key={index}
                          value={char}
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
                          inputProps={{ maxLength: 1 }}
                          disabled={true}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={4}>
                <Typography>Name of Donor:</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Box sx={{ display: "flex" }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {donorName}
                  </Typography>
                  {/* <TextField
                        fullWidth
                        size="small"
                        value={donorName}
                        disabled={true}
                      /> */}
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={4}>
                <Typography>Address of Donor:</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Box sx={{ display: "flex" }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {donorAddress}
                  </Typography>
                  {/* <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={5}
                        value={donorAddress}
                        disabled={true}
                      /> */}
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={4}>
                <Typography>Amount of Donation Received:</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {amountReceived}
                </Typography>
                {/* <TextField
                      fullWidth
                      size="small"
                      value={amountReceived}
                      disabled={true}
                    /> */}
              </Grid>
            </Grid>

            <Grid container spacing={1} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={4}>
                <Typography>Financial Year:</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {financialYear}
                </Typography>
                {/* <TextField
                      fullWidth
                      size="small"
                      value={financialYear}
                      disabled={true}
                    /> */}
              </Grid>
            </Grid>

            <Grid container spacing={0.3} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={4}>
                <Typography>Type of Donation:</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControlLabel
                  control={
                    <Checkbox checked={typeDonation.corpus} disabled={true} />
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
                    <Checkbox checked={typeDonation.others} disabled={true} />
                  }
                  label="Others"
                />
              </Grid>
            </Grid>

            <Grid container spacing={0}>
              <Grid item xs={12} sm={4}>
                <Typography>Section Eligible for Deduction:</Typography>
              </Grid>
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
            </Grid>

            <Grid container spacing={0.3} sx={{ mt: 0.3 }}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "14px" }}>
                  I, <strong>SHOAIB MOHAMMED</strong> son of{" "}
                  <strong>TAJODDIN</strong> solemnly declare that to the best of
                  my knowledge and belief, the information given in the
                  certificate is correct and complete and is in accordance with
                  the provisions of the Income-tax Act, 1961. I further declare
                  that I am making this certificate in my capacity as{" "}
                  <strong>TREASURER</strong> and I am also competent to issue
                  this certificate. I am holding permanent account number{" "}
                  <strong>ALNPG9298E</strong>.
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            spacing={1}
            sx={{ mt: 2, justifyContent: "space-between" }}
          >
            <Grid item>
              <Typography sx={{ fontSize: "14px" }}>Date: </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ fontSize: "14px" }}>Signature:</Typography>
            </Grid>
          </Grid>
        </div>
      </Paper>
      <style>
  {`
    @media print {
      @page {
        size: A4; /* Keep A4 page size */
        margin: 0;
      }

      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      #print-content {
        transform: scale(0.85); /* Adjust scale for mobile */
        transform-origin: top left;
        width: 100vw !important;
        height: 95vh !important; /* Prevents cutting content */
        overflow: hidden !important;
      }

      #print-content, #print-content * {
        page-break-inside: avoid !important;
      }
    }
  `}
</style>

    </>
  );
};

export default memo(DonorPrint);
