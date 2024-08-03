'use client';
import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Dashboard from './components/Dashboard';
import WelcomePage from './components/WelcomePage';
import ShoppingList from './components/ShoppingList';
import { Box, Stack, Typography, Button, Modal, TextField, MenuItem, Select, InputLabel, FormControl, IconButton, CssBaseline, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { firestore } from './firebase';
import { collection, doc, getDocs, query, setDoc, where, deleteDoc } from 'firebase/firestore';

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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expireDate: '',
    category: '',
  });
  const [editItem, setEditItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const fetchInventory = async (category = '') => {
    let snapshot;
    if (category && category !== 'dashboard') {
      snapshot = query(collection(firestore, 'inventory'), where('category', '==', category));
    } else {
      snapshot = query(collection(firestore, 'inventory'));
    }
    const docs = await getDocs(snapshot);
    const items = [];
    docs.forEach((doc) => {
      items.push({ name: doc.id, ...doc.data() });
    });
    setInventory(items);
  };

  useEffect(() => {
    if (selectedCategory === 'dashboard') {
      setShowDashboard(true);
      setShowShoppingList(false);
    } else if (selectedCategory === 'shoppingList') {
      setShowDashboard(false);
      setShowShoppingList(true);
    } else {
      setShowDashboard(false);
      setShowShoppingList(false);
      fetchInventory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleChange = (event) => {
    setNewItem({ ...newItem, [event.target.name]: event.target.value });
  };

  const handleEditChange = (event) => {
    setEditItem({ ...editItem, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    if (newItem.name && newItem.quantity && newItem.category) {
      await setDoc(doc(firestore, 'inventory', newItem.name), newItem);
      fetchInventory(selectedCategory);
      setOpen(false);
      setNewItem({
        name: '',
        quantity: '',
        expireDate: '',
        category: '',
      });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleEditSubmit = async () => {
    if (editItem.name && editItem.quantity && editItem.category) {
      await setDoc(doc(firestore, 'inventory', editItem.name), editItem);
      fetchInventory(selectedCategory);
      setEditOpen(false);
      setEditItem(null);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDelete = async (itemName) => {
    await deleteDoc(doc(firestore, 'inventory', itemName));
    fetchInventory(selectedCategory);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    handleEditOpen();
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showWelcome) {
    return <WelcomePage onContinue={handleContinue} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Navbar
          setCategory={setSelectedCategory}
          handleOpen={handleOpen}
          setSearchTerm={setSearchTerm}
          showDashboard={showDashboard}
          showShoppingList={showShoppingList}
          onShoppingListClick={() => setSelectedCategory('shoppingList')}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: 'background.default',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '64px',
          }}
        >
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-item-modal-title"
            aria-describedby="add-item-modal-description"
          >
            <Box sx={style}>
              <Typography id="add-item-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Item Name"
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Expiration Date"
                  name="expireDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newItem.expireDate}
                  onChange={handleChange}
                  fullWidth
                />
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={newItem.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="Vegetables">Vegetables</MenuItem>
                    <MenuItem value="Fruits">Fruits</MenuItem>
                    <MenuItem value="Dairy">Dairy</MenuItem>
                    <MenuItem value="Grains">Grains</MenuItem>
                    <MenuItem value="Meat">Meat</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSubmit}>
                  Add Item
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Modal
            open={editOpen}
            onClose={handleEditClose}
            aria-labelledby="edit-item-modal-title"
            aria-describedby="edit-item-modal-description"
          >
            <Box sx={style}>
              <Typography id="edit-item-modal-title" variant="h6" component="h2">
                Edit Item
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Item Name"
                  name="name"
                  value={editItem?.name || ''}
                  onChange={handleEditChange}
                  fullWidth
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={editItem?.quantity || ''}
                  onChange={handleEditChange}
                  fullWidth
                />
                <TextField
                  label="Expiration Date"
                  name="expireDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={editItem?.expireDate || ''}
                  onChange={handleEditChange}
                  fullWidth
                />
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={editItem?.category || ''}
                    onChange={handleEditChange}
                    label="Category"
                  >
                    <MenuItem value="Vegetables">Vegetables</MenuItem>
                    <MenuItem value="Fruits">Fruits</MenuItem>
                    <MenuItem value="Dairy">Dairy</MenuItem>
                    <MenuItem value="Grains">Grains</MenuItem>
                    <MenuItem value="Meat">Meat</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={handleEditSubmit}>
                  Update Item
                </Button>
              </Stack>
            </Box>
          </Modal>
          {showDashboard ? (
            <Dashboard inventory={inventory} />
          ) : showShoppingList ? (
            <ShoppingList />
          ) : (
            <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
         <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
         {filteredInventory.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <ListItemButton>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Box>
                <IconButton onClick={() => handleEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(item.name)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}