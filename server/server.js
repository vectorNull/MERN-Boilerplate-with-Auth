const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const connectdB = require('./config/database.js')

const app = express();

dotenv.config({ path: './config/.env'})
app.use(morgan('dev'))
app.use(bodyparser.json())
//app.use(cors());
if(process.env.NODE_ENV = 'development') {
    app.use(cors({ origin: 'http//localhost:3000' }))
}

connectdB();

// Import routes
const authRoutes = require('./routes/auth');

// middleware
app.use('/api/v1/', authRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `);
});
