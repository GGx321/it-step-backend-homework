const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== 'SECRET123') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Valid API key required'
        });
    }
    
    next();
};

module.exports = requireApiKey;
