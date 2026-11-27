'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: HomeOutlinedIcon },
  { label: 'Create New', href: '/create', icon: AddCircleOutlinedIcon },
  { label: 'Generate & Output', href: '/generate', icon: AutoAwesomeIcon },
];

export default function TopAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 1 }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                color: 'inherit',
                minWidth: 0,
              }}
            >
              <CalendarMonthIcon sx={{ flexShrink: 0 }} />
              <Typography
                variant="h6"
                component="span"
                noWrap
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  fontSize: { xs: '1rem', sm: '1.15rem' },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  School Timetable Generator – Pre-KG to XII
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Timetable Generator
                </Box>
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    color="inherit"
                    startIcon={<Icon />}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            {/* Mobile Hamburger Button */}
            <IconButton
              color="inherit"
              edge="end"
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 260, pt: 2 }} role="presentation">
          <Typography variant="subtitle1" sx={{ px: 2.5, pb: 1.5, fontWeight: 800, color: '#0f172a' }}>
            Pre-KG to XII
          </Typography>
          <List>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemIcon sx={{ minWidth: 38 }}>
                    <Icon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
