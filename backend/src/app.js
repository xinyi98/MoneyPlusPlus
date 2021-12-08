const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const mongodb = require('./mongodb/database');

// Setup Express
const app = express();

// Connect to MongoDB
mongodb.connect();

// Setup body-parser
app.use(express.json());

app.use(cors());

app.use('/api', apiRoutes);

module.exports = app;
