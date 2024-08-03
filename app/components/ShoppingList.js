import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Paper, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '../firebase';
import { collection, setDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'shoppingList'));
    const itemsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(itemsArray);
  };

  const handleAddItem = async () => {
    if (newItem.trim()) {
      const itemName = newItem.trim();
      await setDoc(doc(firestore, 'shoppingList', itemName), { name: itemName });
      setItems([...items, { id: itemName, name: itemName }]);
      setNewItem('');
    }
  };

  const handleDeleteItem = async (id) => {
    await deleteDoc(doc(firestore, 'shoppingList', id));
    setItems(items.filter(item => item.id !== id));
  };

  const handleClearItems = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'shoppingList'));
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    setItems([]);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Shopping List
        </Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            variant="outlined"
            label="New Item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            sx={{ ml: 2, display: 'flex', alignItems: 'center' }}
          >
            <AddIcon />
          </Button>
        </Box>
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <List>
            {items.map(item => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  mb: 1,
                  borderRadius: '8px',
                  p: 1,
                }}
              >
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearItems}
            fullWidth
          >
            Clear All
          </Button>
        </Paper>
      </Paper>
    </Container>
  );
};

export default ShoppingList;