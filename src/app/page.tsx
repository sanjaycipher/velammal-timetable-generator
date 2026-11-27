'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SchoolIcon from '@mui/icons-material/School';

const STATS = [
  {
    label: '18 Teachers Loaded',
    caption: 'Faculty & Subject Allotments',
    icon: PeopleOutlinedIcon,
    color: 'primary.main',
    bgColor: 'rgba(25, 118, 210, 0.08)',
  },
  {
    label: '6 Classes',
    caption: 'Secondary Compartment (IX & X)',
    icon: ClassOutlinedIcon,
    color: 'secondary.main',
    bgColor: 'rgba(156, 39, 176, 0.08)',
  },
  {
    label: 'AI Solver: Ready',
    caption: 'Automated Conflict-Free Engine',
    icon: AutoAwesomeIcon,
    color: 'success.main',
    bgColor: 'rgba(46, 125, 50, 0.08)',
  },
];

export default function HomePage() {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: '#f5f7fb',
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', mb: 6 }}>
          <Chip
            label="Academic Year 2026–27"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.85rem', md: '2.6rem' },
            }}
          >
            School Timetable Generator – Pre-KG to XII
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 640,
            }}
          >
            Automated class, section, and teacher scheduling from Pre-KG to Class XII.
          </Typography>
        </Stack>

        {/* Dashboard Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2.5,
            mb: 5,
          }}
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Paper
                key={stat.label}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.caption}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>

        {/* Hero Section: Two Large Action Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          {/* Card 1: Open Velammal Vidyalaya */}
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                <SchoolIcon fontSize="large" />
              </Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Open Velammal Vidyalaya
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Load the pre-configured 2026-27 Secondary Compartment timetable.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: { xs: 2.5, sm: 4 }, pb: { xs: 2.5, sm: 4 }, pt: 0 }}>
              <Button
                component={Link}
                href="/workspace"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ fontWeight: 600, px: 3, py: 1.25, borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
              >
                Open Workspace
              </Button>
            </CardActions>
          </Card>

          {/* Card 2: Create New School Setup */}
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: 'rgba(156, 39, 176, 0.1)',
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                <AddCircleOutlinedIcon fontSize="large" />
              </Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Create New School Setup
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Start a brand new timetable from scratch.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: { xs: 2.5, sm: 4 }, pb: { xs: 2.5, sm: 4 }, pt: 0 }}>
              <Button
                component={Link}
                href="/create"
                variant="outlined"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ fontWeight: 600, px: 3, py: 1.25, borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
              >
                Start Setup
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
