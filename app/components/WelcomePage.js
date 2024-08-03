import React from 'react';
import { Box, Typography, Button, Container, Paper, Grid, Icon } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InventoryIcon from '@mui/icons-material/Inventory';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#457b9d',
      },
      secondary: {
        main: '#457b9d',
      },
      background: {
        default: '#f1faee',
      },
      text: {
        primary: '#1d3557',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });


const WelcomePage = ({ onContinue }) => {
  const features = [
    { icon: <KitchenIcon fontSize="large" />, title: "Pantry Management", description: "Organize and track your pantry items effortlessly." },
    { icon: <ShoppingCartIcon fontSize="large" />, title: "Smart Shopping Lists", description: "Create and manage your shopping lists with ease." },
    { icon: <DateRangeIcon fontSize="large" />, title: "Expiration Tracking", description: "Never let food go to waste with expiration date reminders." },
    { icon: <InventoryIcon fontSize="large" />, title: "Inventory Overview", description: "Get a quick glance at your kitchen inventory anytime." },
  ];

  return (
    <ThemeProvider theme={theme}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0f7fa', // Pastel green background color
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
            Welcome to Pantry Pilot
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="textSecondary">
            Your Smart Kitchen Management Solution
          </Typography>
          <Grid container spacing={2} sx={{ my: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper elevation={2} sx={{ 
                  p: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  backgroundColor: '#f0f4f8', // Light pastel color for feature cards
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s',
                  },
                }}>
                  <Icon color="primary" sx={{ fontSize: 40, mb: 1 }}>{feature.icon}</Icon>
                  <Typography variant="subtitle1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>{feature.title}</Typography>
                  <Typography variant="body2" color="textSecondary" align="center">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body1" paragraph align="center">
            Pantry Pilot helps you organize your pantry, track your groceries, and streamline your shopping experience. 
            Say goodbye to food waste and hello to a more efficient kitchen!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onContinue}
              sx={{ 
                mt: 2, 
                py: 1, 
                px: 4, 
                borderRadius: '20px',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s',
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
    </ThemeProvider>
  );
};

export default WelcomePage;