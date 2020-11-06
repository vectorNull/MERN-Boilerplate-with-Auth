const express = require('express');

const app = express();

app.get('/api/v1/signup', (req, res) => {
    res.json({
        success: true,
        data: 'Signup endpoint',
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
});
