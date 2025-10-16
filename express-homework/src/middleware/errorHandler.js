const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'ValidationError',
            details: err.message
        });
    }
    
    if (err.status === 404) {
        return res.status(404).json({
            error: 'Not Found',
            message: err.message || 'Resource not found'
        });
    }
    
    res.status(500).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

module.exports = errorHandler;
