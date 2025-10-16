const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            error: 'ValidationError',
            message: 'Email and password are required'
        });
    }
    
    res.json({
        status: 'registered',
        email: email
    });
});

module.exports = router;
