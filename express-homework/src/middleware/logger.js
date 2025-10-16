const logger = (req, res, next) => {
    const startTime = new Date();
    const timestamp = startTime.toISOString();
    
    res.on('finish', () => {
        const duration = new Date() - startTime;
        console.log(`[${timestamp}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    
    next();
};

module.exports = logger;
