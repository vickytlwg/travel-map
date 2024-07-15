require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST ||'rm-bp176mrr5vbl9jf12qo.mysql.rds.aliyuncs.com',
    user: process.env.DB_USER || 'lee',
    password: process.env.DB_PASSWORD ||'Lbwzx200612132',
    database: process.env.DB_NAME || 'travel'
    });

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/cities', (req, res) => {
    const query = 'SELECT * FROM cities';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching cities:', err);
            res.status(500).json({ error: 'Failed to fetch cities' });
            return;
        }
        res.json(results);
    });
});

app.post('/add-city', (req, res) => {
    const { name } = req.body;
    const checkQuery = 'SELECT * FROM cities WHERE name = ?';
    db.query(checkQuery, [name], (err, results) => {
        if (err) {
            console.error('Error checking city:', err);
            res.status(500).json({ error: 'Failed to check city' });
            return;
        }
        if (results.length > 0) {
            res.status(400).json({ error: 'City already exists' });
            return;
        }

        const latitude = 0; // 更新为实际经纬度
        const longitude = 0;

        const insertQuery = 'INSERT INTO cities (name, latitude, longitude) VALUES (?, ?, ?)';
        db.query(insertQuery, [name, latitude, longitude], (err, result) => {
            if (err) {
                console.error('Error adding city:', err);
                res.status(500).json({ error: 'Failed to add city' });
                return;
            }
            res.status(201).json({ message: 'City added successfully' });
        });
    });
});

app.delete('/delete-city/:id', (req, res) => {
    const cityId = req.params.id;
    console.log(`Deleting city with ID: ${cityId}`);
  
    const query = 'DELETE FROM cities WHERE id = ?';
    db.query(query, [cityId], (err, result) => {
      if (err) {
        console.error('Error deleting city from database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (result.affectedRows === 0) {
        console.log('City not found');
        res.status(404).send('City not found');
        return;
      }
  
      console.log('City deleted successfully');
      res.status(200).send('City deleted successfully');
    });
  });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

if (module.hot) {
    module.hot.accept();
  }
  