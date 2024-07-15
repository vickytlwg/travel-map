const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'rm-bp176mrr5vbl9jf12qo.mysql.rds.aliyuncs.com',
    user: 'lee',
    password: 'Lbwzx200612132',
    database: 'travel'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(express.json());

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
        if (results?.length > 0) {
            res.status(400).json({ error: 'City already exists' });
            return;
        }

        const latitude = 0;
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});