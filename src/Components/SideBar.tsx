"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const pathname = usePathname();
  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const handleEmployeeClick = () => {
    if (collapsed) {
      setCollapsed(false);
      setEmployeeOpen(true);
    } else {
      setEmployeeOpen((previous) => !previous);
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width,
        flexShrink: 0,
        transition: "width 0.2s ease",
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          position: "relative",
          height: "100%",
          overflowX: "hidden",
          borderLeft: "1px solid #e5e7eb",
          borderRight: 0,
          bgcolor: "#ffffff",
          transition: "width 0.2s ease",
        },
      }}
    >
      {/* Sidebar heading and collapse button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          p: 1.5,
          minHeight: 48,
        }}
      >
        {!collapsed && (
          <Typography
            sx={{
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            Navigation
          </Typography>
        )}

        <IconButton
          size="small"
          onClick={() => setCollapsed((previous) => !previous)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1.5 }}>
        {/* Dashboard */}
        <Tooltip title={collapsed ? "Dashboard" : ""} placement="left">
          <ListItemButton
            onClick={(event) => {
              event.preventDefault();
            }}
            sx={{
              minHeight: 44,
              mb: 0.5,
              borderRadius: 2,
              justifyContent: collapsed ? "center" : "initial",
              px: 1.5,
              color: "text.primary",
              "&:hover": {
                bgcolor: "#f3f4f6",
              },
              "&:active": {
                bgcolor: "#e5e7eb",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 40,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <LayoutDashboard size={21} />
            </ListItemIcon>

            {!collapsed && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </Tooltip>

        {/* Employee dropdown */}
        <Tooltip title={collapsed ? "Employee" : ""} placement="left">
          <ListItemButton
            onClick={handleEmployeeClick}
            selected={pathname === "/" || pathname.startsWith("/employees")}
            aria-expanded={!collapsed && employeeOpen}
            sx={{
              minHeight: 44,
              mb: 0.5,
              borderRadius: 2,
              justifyContent: collapsed ? "center" : "initial",
              px: 1.5,
              "&.Mui-selected": {
                bgcolor: "#eff6ff",
                color: "#2563eb",
              },
              "&.Mui-selected:hover": {
                bgcolor: "#dbeafe",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 40,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <Users size={21} />
            </ListItemIcon>

            {!collapsed && (
              <>
                <ListItemText primary="Employee" />

                <ChevronDown
                  size={18}
                  style={{
                    transform: employeeOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </>
            )}
          </ListItemButton>
        </Tooltip>

        {/* Employee submenu */}
        <Collapse in={!collapsed && employeeOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItemButton
              component={Link}
              href="/"
              selected={pathname === "/"}
              sx={{
                pl: 5,
                py: 1,
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "#dbeafe",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: "inherit",
                }}
              >
                <UserRound size={18} />
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography sx={{ fontSize: 14 }}>Employee List</Typography>
                }
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
