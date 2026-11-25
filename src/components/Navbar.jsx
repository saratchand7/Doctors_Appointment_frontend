
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Typography,
  IconButton,
  Drawer,
  Badge,
  Menu,
  MenuItem
} from "@mui/material";

import {
  HeartPulse,
  Home,
  Stethoscope,
  Heart,
  CalendarDays,
  LayoutDashboard,
  UserPlus,
  LogOut,
  LogIn,
  Menu as MenuIcon,
  ChevronDown
} from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const favoritesCount = useSelector(
    (state) => state.favorites[String(user?.id)]?.length || 0
  );

  useEffect(() => {
    let active = true;

    setProfileImage("");

    async function loadProfile() {
      if (!user) return;

      try {
        const endpoint =
          user.role === "doctor" && user.doctorId
            ? `/doctors/${user.doctorId}`
            : `/users/${user.id}`;

        const response = await api.get(endpoint);

        if (active) {
          setProfileImage(response.data.image || "");
        }
      } catch {
        if (active) setProfileImage("");
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  function handleLogout() {
    setAnchorEl(null);
    setDrawerOpen(false);
    logout();
    toast.success("Logged out successfully!");
    navigate("/login", { replace: true });
  }

  const initials = (user?.name || "User")
    .replace(/^Dr\.\s*/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const links = [
    { name: "Home", path: "/", icon: Home },
    {
      name: "Doctors",
      path: "/doctors",
      icon: Stethoscope
    }
  ];

  if (user?.role === "patient") {
    links.push(
      {
        name: "Favorites",
        path: "/favorites",
        icon: Heart
      },
      {
        name: "Appointments",
        path: "/my-appointments",
        icon: CalendarDays
      }
    );
  }

  if (user) {
    links.push({
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    });
  }

  if (user?.role === "admin") {
    links.push({
      name: "Add Doctor",
      path: "/doctors/add",
      icon: UserPlus
    });
  }

  function renderLinks() {
    return links.map(({ name, path, icon: Icon }) => (
      <Button
        key={path}
        component={Link}
        to={path}
        color="inherit"
        onClick={() => setDrawerOpen(false)}
        startIcon={
          name === "Favorites" ? (
            <Badge
              badgeContent={favoritesCount}
              color="error"
            >
              <Icon size={19} />
            </Badge>
          ) : (
            <Icon size={19} />
          )
        }
        sx={{ whiteSpace: "nowrap" }}
      >
        {name}
      </Button>
    ));
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(110deg,#123b60,#176bba)",
          borderBottom: "1px solid rgba(255,255,255,.15)"
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: 76 }}>

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "white",
              textDecoration: "none"
            }}
          >
            <HeartPulse size={32} />
            <Typography variant="h5" fontWeight={800}>
              MediCare
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: 0.5
            }}
          >
            {renderLinks()}
          </Box>

          {user ? (
            <>
              <Button
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                endIcon={<ChevronDown size={16} />}
                sx={{ gap: 1 }}
              >
                <Avatar
                  src={profileImage || undefined}
                  alt={user.name}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#0891b2",
                    border: "2px solid white"
                  }}
                >
                  {initials}
                </Avatar>

                <Box
                  sx={{
                    textAlign: "left",
                    display: { xs: "none", sm: "block" }
                  }}
                >
                  <Typography fontSize={13} fontWeight={700}>
                    {user.name}
                  </Typography>

                  <Typography
                    fontSize={11}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {user.role}
                  </Typography>
                </Box>
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/dashboard");
                  }}
                >
                  <LayoutDashboard size={18} />
                  &nbsp; Dashboard
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <LogOut size={18} />
                  &nbsp; Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<LogIn size={18} />}
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "#176bba",
                  display: { xs: "none", sm: "inline-flex" },
                  "&:hover": { bgcolor: "#e0f2fe" }
                }}
              >
                Register
              </Button>
            </Box>
          )}

          <IconButton
            color="inherit"
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>

        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 270,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Typography variant="h5" fontWeight={800}>
            MediCare
          </Typography>

          {renderLinks()}

          {!user && (
            <Button
              component={Link}
              to="/register"
              onClick={() => setDrawerOpen(false)}
            >
              Register
            </Button>
          )}

          {user && (
            <Button
              color="error"
              startIcon={<LogOut size={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
