const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env variables
dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

app.use(errorHandler);

module.exports = app;