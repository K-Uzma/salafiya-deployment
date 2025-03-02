import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Add, FileDownload, Visibility } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { DonorsList } from "../../../api/modules/donorModule";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const DonorList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Column Definitions
  const columns = useMemo(
    () => [
      {
        header: "View",
        Cell: ({ row }) => (
          <Tooltip title="View & Print">
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
        ),
        size: 30,
      },
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
        accessorKey: "aadhar_id",
        header: "Aadhar Number",
        muiTableHeadCellProps: { sx: { width: "100px" } },
        muiTableBodyCellProps: { sx: { width: "100px" } },
      },
      {
        accessorKey: "mobile",
        header: "Phone Number",
        muiTableHeadCellProps: { sx: { width: "80px" } },
        muiTableBodyCellProps: { sx: { width: "80px" } },
      },
      {
        accessorKey: "donor_address",
        header: "Address",
        muiTableHeadCellProps: { sx: { width: "180px" } },
        muiTableBodyCellProps: { sx: { width: "180px" } },
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
      "Phone Number": item.mobile,
      Address: item.donor_address,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donors");
    XLSX.writeFile(wb, "Donors_Details.xlsx");
  };

  return loading ? (
    <CircularProgress size={30} sx={{ color: "#2e7d32" }} />
  ) : (
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
        renderTopToolbarCustomActions={() => (
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
        )}
      />
    </Box>
  );
};

export default DonorList;
