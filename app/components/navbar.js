"use client";
import * as React from 'react';
import { Box, Drawer, AppBar, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, TextField, InputAdornment, Button, Collapse, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppleIcon from '@mui/icons-material/Apple';
import EggIcon from '@mui/icons-material/Egg';
import GrassIcon from '@mui/icons-material/Grass';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LabelIcon from '@mui/icons-material/Label';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#a8dadc',
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

export default function Navbar({ setCategory, handleOpen, setSearchTerm, showDashboard, showShoppingList, onShoppingListClick }) {
  const [open, setOpen] = React.useState(true);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCategoryClick = () => {
    setCategoryOpen(!categoryOpen);
  };

  const categories = [
    { text: 'Vegetables', icon: <FontAwesomeIcon icon={faCarrot} /> },
    { text: 'Fruits', icon: <AppleIcon /> },
    { text: 'Dairy', icon: <EggIcon /> },
    { text: 'Grains', icon: <GrassIcon /> },
    { text: 'Meat', icon: <RestaurantIcon /> },
    { text: 'Others', icon: <LabelIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginRight: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LocalDiningIcon sx={{ marginRight: 1 }} />
            PANTRY PILOT
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpen}
            sx={{ marginRight: 2 }}
          >
            Add
          </Button>
          {!showDashboard && !showShoppingList && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: 'white',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                },
              }}
            />
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', padding: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCategory('dashboard')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            </List>
            <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCategory('')}>
                <ListItemIcon>
                  <ViewListIcon />
                </ListItemIcon>
                <ListItemText primary="All Items" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleCategoryClick}>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Categories" />
              {categoryOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={categoryOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories.map(({ text, icon }) => (
                  <ListItem key={text} sx={{ pl: 4 }}>
                    <ListItemButton onClick={() => setCategory(text)}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={onShoppingListClick}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Shopping List" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
    </ThemeProvider>
  );
}