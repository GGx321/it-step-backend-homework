const express = require('express');
const logger = require('./middleware/logger');
const requireApiKey = require('./middleware/requireApiKey');
const errorHandler = require('./middleware/errorHandler');
const booksRoutes = require('./routes/books.routes');
const usersRoutes = require('./routes/users.routes');

const profileRoutes = require('./routes/homework/profile.routes');
const coursesRoutes = require('./routes/homework/courses.routes');
const registerRoutes = require('./routes/homework/register.routes');
const tasksRoutes = require('./routes/homework/tasks.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(logger);

// Rate limiting (BONUS feature)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 60;

const rateLimit = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitMap.has(clientIP)) {
        rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return next();
    }
    
    const clientData = rateLimitMap.get(clientIP);
    
    if (now > clientData.resetTime) {
        clientData.count = 1;
        clientData.resetTime = now + RATE_LIMIT_WINDOW;
        return next();
    }
    
    if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Try again later.'
        });
    }
    
    clientData.count++;
    next();
};

app.use(rateLimit);

// Routes
app.use('/api/books', booksRoutes);
app.use('/api/users', requireApiKey, usersRoutes);

// Homework routes
app.use('/profile', profileRoutes);
app.use('/courses', coursesRoutes);
app.use('/register', registerRoutes);
app.use('/tasks', tasksRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for all unmatched routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'API endpoint not found'
    });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Books API: http://localhost:${PORT}/api/books`);
    console.log(`Users API: http://localhost:${PORT}/api/users`);
});

module.exports = app;
