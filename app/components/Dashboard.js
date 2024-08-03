import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, Grid, Container, useTheme, useMediaQuery } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import DeleteIcon from '@mui/icons-material/Delete';
import { firestore } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [categories, setCategories] = useState({});
  const [expiringItems, setExpiringItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'inventory'));
        const items = [];
        snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

        const today = new Date();
        const todayString = formatDate(today);
        const tenDaysFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
        const tenDaysFromNowString = formatDate(tenDaysFromNow);

        const expiringItems = items.filter(item => item.expireDate > todayString && item.expireDate <= tenDaysFromNowString);
        setExpiringItems(expiringItems.map(item => ({ id: item.id, name: item.name, expireDate: item.expireDate })));

        const expiredItems = items.filter(item => item.expireDate <= todayString);
        setExpiredItems(expiredItems.map(item => ({ id: item.id, name: item.name, expireDate: item.expireDate })));

        const categoryCount = items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {});
        setCategories(categoryCount);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleDeleteExpiredItem = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, 'inventory', itemId));
      setExpiredItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#AEC6CF', '#F6C1C0'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center" fontSize={16}>
              Categories Distribution
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ height: '100%', width: '100%' }}>
                <Pie data={data} options={chartOptions} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            <ExpiringItemsList items={expiringItems} />
            <ExpiredItemsList items={expiredItems} onDelete={handleDeleteExpiredItem} />
          </Box>
        </Grid>
      </Grid>
    </Container>
    </ThemeProvider>
  );
};

function ExpiringItemsList({ items }) {
  return (
    <Paper elevation={3} sx={{ p: 1, flexGrow: 1, overflow: 'auto', maxHeight: '300px' }}>
      <Typography variant="subtitle1" align='center' gutterBottom>
        Expiring Soon...
      </Typography>
      <List dense>
        {items.map(item => (
          <ListItem key={item.id} divider>
            <ListItemText 
              primary={item.name} 
              secondary={`Expires: ${item.expireDate}`}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

function ExpiredItemsList({ items, onDelete }) {
  return (
    <Paper elevation={3} sx={{ p: 1, flexGrow: 1, overflow: 'auto', maxHeight: '300px' }}>
      <Typography variant="subtitle1" align='center' gutterBottom>
        Expired Items
      </Typography>
      <List dense>
        {items.map(item => (
          <ListItem 
            key={item.id} 
            divider
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText 
              primary={item.name} 
              secondary={`Expired: ${item.expireDate}`}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default Dashboard;