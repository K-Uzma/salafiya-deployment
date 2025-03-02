import React, { memo, useState } from "react";
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("sal_cam_token");
    toast.success("Logout Successfully");
    navigate("/login");
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 250,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", fontWeight: "bold", mt: 2 }}
      >
        Salafiya Education & Welfare Trust
      </Typography>
      <Typography
        variant="caption"
        sx={{ textAlign: "center", display: "block" }}
      >
        Solapur
      </Typography>

      <List sx={{ mt: 2 }}>
        {[
          { text: "Home", path: "/dashboard" },
          { text: "Add Donor", path: "/add-donor" },
        ].map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleNavigation(item.path)}
            sx={{
              bgcolor: location.pathname === item.path ? "#2e7d3275" : "inherit",
              cursor: "pointer",
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Button
        color="error"
        sx={{
          mt: "auto",
          alignSelf: "center",
          display: "flex",
          gap: 1,
          p: 1.5,
          borderRadius: 2,
        }}
        startIcon={<LogoutIcon />}
        onClick={() => setOpenLogoutDialog(true)}
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            sx={{ position: "absolute", top: 10, left: 10, zIndex: 2000 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            sx={{ "& .MuiDrawer-paper": { width: 250 } }}
          >
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 250,
              boxSizing: "border-box",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#d32f2f" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <LogoutIcon sx={{ fontSize: 50, color: "#d32f2f" }} />
            <DialogContentText sx={{ fontSize: "1.1rem", textAlign: "center" }}>
              Are you sure you want to logout?
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setOpenLogoutDialog(false)} variant="outlined" color="primary">
            No
          </Button>
          <Button onClick={handleLogout} variant="contained" color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(Sidebar);
