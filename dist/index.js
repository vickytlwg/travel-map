"use strict";

require('dotenv').config();
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;
var db = mysql.createConnection({
  host: process.env.DB_HOST || 'rm-bp176mrr5vbl9jf12qo.mysql.rds.aliyuncs.com',
  user: process.env.DB_USER || 'lee',
  password: process.env.DB_PASSWORD || 'Lbwzx200612132',
  database: process.env.DB_NAME || 'travel'
});
db.connect(function (err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});
app.use(express.json());
app.use(express["static"](path.join(__dirname, 'public')));
app.get('/cities', function (req, res) {
  var query = 'SELECT * FROM cities';
  db.query(query, function (err, results) {
    if (err) {
      console.error('Error fetching cities:', err);
      res.status(500).json({
        error: 'Failed to fetch cities'
      });
      return;
    }
    res.json(results);
  });
});
app.post('/add-city', function (req, res) {
  var name = req.body.name;
  var checkQuery = 'SELECT * FROM cities WHERE name = ?';
  db.query(checkQuery, [name], function (err, results) {
    if (err) {
      console.error('Error checking city:', err);
      res.status(500).json({
        error: 'Failed to check city'
      });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({
        error: 'City already exists'
      });
      return;
    }
    var latitude = 0; // 更新为实际经纬度
    var longitude = 0;
    var insertQuery = 'INSERT INTO cities (name, latitude, longitude) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, latitude, longitude], function (err, result) {
      if (err) {
        console.error('Error adding city:', err);
        res.status(500).json({
          error: 'Failed to add city'
        });
        return;
      }
      res.status(201).json({
        message: 'City added successfully'
      });
    });
  });
});
app["delete"]('/delete-city/:id', function (req, res) {
  var cityId = req.params.id;
  console.log("Deleting city with ID: ".concat(cityId));
  var query = 'DELETE FROM cities WHERE id = ?';
  db.query(query, [cityId], function (err, result) {
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
app.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});
if (module.hot) {
  module.hot.accept();
}