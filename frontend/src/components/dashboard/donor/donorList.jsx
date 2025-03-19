import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Add,
  Delete,
  FileDownload,
  HelpOutline,
  Visibility,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { DeleteDonorByID, DonorsList } from "../../../api/modules/donorModule";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { toast } from "react-toastify";

const DonorList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [scaidId, setScaidId] = useState(0);

  const handleNavigate = () => {
    navigate("/add-donor");
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DonorsList();
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDeleteDialog = (scaid_id) => {
    setScaidId(scaid_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setScaidId(0);
    setOpenDeleteDialog(false);
  };

  const handleDeleteYes = async () => {
    if (scaidId != 0) {
      const response = await DeleteDonorByID(scaidId);
      toast.success(response.message);
      fetchData();
    }
    handleCloseDeleteDialog();
  };

  const formatDonationType = (donationType) => {
    return donationType
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
      .replace(/,/g, ", ") // Add space after commas
      .toLowerCase() // Convert everything to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  };

  const sectionMapping = {
    section80G: "Section 80G(5)(vi)",
    section35_1_ii: "Section 35(1)(ii)",
    section35_1_iia: "Section 35(1)(iia)",
    section35_1_iii: "Section 35(1)(iii)",
  };

  const formatDonationSection = (sectionStr) => {
    return sectionStr
      .split(",") // Split multiple values
      .map((section) => sectionMapping[section] || section) // Replace with mapped value
      .join(", "); // Join back with a comma and space
  };

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  // Column Definitions
  const columns = useMemo(
    () => [
      {
        accessorKey: "donor_name",
        header: "Donor Name",
        muiTableHeadCellProps: { sx: { width: "150px" } }, // Set width for header
        muiTableBodyCellProps: { sx: { width: "150px" } }, // Set width for body
      },
      {
        accessorKey: "pan_id",
        header: "PAN Number",
        muiTableHeadCellProps: { sx: { width: "80px" } },
        muiTableBodyCellProps: { sx: { width: "80px" } },
      },
      {
        accessorKey: "financial_year",
        header: "Financial Year",
        muiTableHeadCellProps: { sx: { width: "80px" } },
        muiTableBodyCellProps: { sx: { width: "80px" } },
      },
      // {
      //   accessorKey: "aadhar_id",
      //   header: "Aadhar Number",
      //   muiTableHeadCellProps: { sx: { width: "100px" } },
      //   muiTableBodyCellProps: { sx: { width: "100px" } },
      // },
      // {
      //   accessorKey: "mobile",
      //   header: "Phone Number",
      //   muiTableHeadCellProps: { sx: { width: "80px" } },
      //   muiTableBodyCellProps: { sx: { width: "80px" } },
      // },
      // {
      //   accessorKey: "donor_address",
      //   header: "Address",
      //   muiTableHeadCellProps: { sx: { width: "180px" } },
      //   muiTableBodyCellProps: { sx: { width: "180px" } },
      // },
      {
        accessorKey: "donation_received",
        header: "Donated Amount",
        muiTableHeadCellProps: { sx: { width: "80px" } },
        muiTableBodyCellProps: { sx: { width: "80px" } },
      },
      {
        accessorKey: "donation_type",
        header: "Donation Type",
        muiTableHeadCellProps: { sx: { width: "100px" } },
        muiTableBodyCellProps: { sx: { width: "100px" } },
        Cell: ({ cell }) => formatDonationType(cell.getValue()), // Use function in Cell
      },
      // {
      //   accessorKey: "donation_section",
      //   header: "Section Eligible for Deduction",
      //   muiTableHeadCellProps: { sx: { width: "130px" } },
      //   muiTableBodyCellProps: { sx: { width: "130px" } },
      //   Cell: ({ cell }) => formatDonationSection(cell.getValue()), // Use function in Cell
      // },
      // {
      //   accessorKey: "approval_date",
      //   header: "Approval Date",
      //   muiTableHeadCellProps: { sx: { width: "130px" } },
      //   muiTableBodyCellProps: { sx: { width: "130px" } },
      //   Cell: ({ cell }) => formatDate(cell.getValue()), // Format in the table cell
      // },
      {
        header: "Actions",
        Cell: ({ row }) => (
          <>
            <Tooltip title="View & Print Record">
              <IconButton
                color="primary"
                onClick={() =>
                  navigate("/view-donor", {
                    state: { donorId: row.original.scaid_id },
                  })
                }
              >
                <Visibility />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Record">
              <IconButton
                sx={{ color: "red" }}
                onClick={() => handleOpenDeleteDialog(row.original.scaid_id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        ),
        size: 30,
      },
    ],
    []
  );

  // Export to Excel
  const exportToExcel = () => {
    const formattedData = data.map((item) => ({
      "Donor Name": item.donor_name,
      "PAN Number": item.pan_id,
      "Aadhar Number": item.aadhar_id,
      "Financial Year": item.financial_year,
      "Donated Amount": item.donation_received,
      // "Phone Number": item.mobile,
      // Address: item.donor_address,
      "Donation Type": formatDonationType(item.donation_type),
      // "Section Eligible for Deduction": formatDonationSection(
      //   item.donation_section
      // ),
      // "Approval Date": formatDate(item.approval_date),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donors");
    XLSX.writeFile(wb, "Donors_Details.xlsx");
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
    <>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <MaterialReactTable
          columns={columns}
          data={data}
          enablePagination
          enableSorting
          enableColumnFilters
          enableDensityToggle={!isMobile}
          muiTableContainerProps={{
            sx: {
              maxHeight: "calc(100vh - 180px)",
              overflowX: "auto",
              overflowY: "auto",
              minWidth: isMobile ? "100%" : "1000px",
              backgroundColor: "#f8f9fa", // Background for table container
            },
          }}
          muiTablePaperProps={{
            sx: {
              boxShadow: "none",
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              padding: isMobile ? "6px" : "12px",
              fontWeight: "bold",
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              padding: isMobile ? "6px" : "12px",
              whiteSpace: isMobile ? "normal" : "nowrap",
              wordBreak: "break-word",
              backgroundColor: "#f8f9fa", // Row background
            },
          }}
          muiTableBodyRowProps={{
            sx: {
              backgroundColor: "#f8f9fa", // Apply to all rows
              "&:hover": {
                backgroundColor: "#e8e8e8", // Slight hover effect
              },
            },
          }}
          renderTopToolbarCustomActions={() =>
            isMobile ? (
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  justifyContent: isMobile ? "center" : "flex-start",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <Tooltip title="Export Excel">
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={exportToExcel}
                    size="small"
                  >
                    <FileDownload />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Add Donor">
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={handleNavigate}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  justifyContent: isMobile ? "center" : "flex-start",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<FileDownload />}
                  onClick={exportToExcel}
                  size="small"
                  sx={{
                    px: 2,
                    py: 0.5,
                    fontSize: isMobile ? "0.65rem" : "0.75rem",
                  }}
                >
                  Export Excel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleNavigate}
                  size="small"
                  sx={{
                    px: 2,
                    py: 0.5,
                    fontSize: isMobile ? "0.65rem" : "0.75rem",
                  }}
                >
                  Add Donor
                </Button>
              </Box>
            )
          }
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => handleCloseDeleteDialog()}>
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", color: "#d32f2f" }}
        >
          Delete Record
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <HelpOutline sx={{ fontSize: 50, color: "#d32f2f" }} />
            <DialogContentText sx={{ fontSize: "1.1rem", textAlign: "center" }}>
              Are you sure you want to delete this record?
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={handleDeleteYes}
            variant="contained"
            color="error"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DonorList;
