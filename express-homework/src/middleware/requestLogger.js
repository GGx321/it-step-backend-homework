const requestLogger = (req, res, next) => {
    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").slice(0, 19);
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

module.exports = requestLogger;
