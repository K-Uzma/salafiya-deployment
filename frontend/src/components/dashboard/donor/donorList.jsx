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
import { FileDownload, Visibility } from "@mui/icons-material";
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
        boxShadow: "none",
      }}
    >
      <MaterialReactTable
        columns={columns}
        data={data}
        enablePagination
        enableSorting
        enableColumnFilters
        enableDensityToggle={!isMobile} // Hide density toggle on mobile
        muiTableContainerProps={{
          sx: {
            maxHeight: "calc(100vh - 180px)",
            overflowX: "auto",
            overflowY: "auto",
            minWidth: isMobile ? "100%" : "1000px", // Adjust for mobile
            boxShadow: "none",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontSize: isMobile ? "0.75rem" : "0.875rem", // Reduce font size on mobile
            padding: isMobile ? "6px" : "12px", // Adjust cell padding
            whiteSpace: isMobile ? "normal" : "nowrap", // Prevent overflow
            wordBreak: "break-word", // Ensure text wrapping
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            padding: isMobile ? "6px" : "12px",
          },
        }}
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: isMobile ? "wrap" : "nowrap",
              justifyContent: isMobile ? "center" : "flex-start",
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
                fontSize: isMobile ? "0.65rem" : "0.75rem", // Adjust button size
              }}
            >
              Export Excel
            </Button>
          </Box>
        )}
      />
    </Box>
  );
};

export default DonorList;
