const express = require('express');

const app = express();

// Import routes
const authRoutes = require('./routes/auth')

// middleware
app.use('/api/v1/', authRoutes)





const PORT = 5000;

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
});
