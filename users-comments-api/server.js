import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { logger } from "./middleware/logger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/users_comments";

// =====================================================
// Middleware
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// =====================================================
// Підключення до MongoDB
// =====================================================

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Підключено до MongoDB');
        console.log(`📦 База даних: ${mongoose.connection.name}`);
    })
    .catch((err) => {
        console.error('❌ Помилка підключення до MongoDB:', err);
        process.exit(1);
    });

// =====================================================
// Маршрути
// =====================================================

// Головна сторінка
app.get('/', (req, res) => {
    res.json({
        message: 'Users & Comments API',
        version: '1.0.0',
        endpoints: {
            users: {
                'POST /users': 'Створити користувача',
                'GET /users': 'Отримати всіх користувачів (pagination: ?page=1&limit=10)',
                'GET /users/:id': 'Отримати користувача з коментарями',
                'PUT /users/:id': 'Оновити користувача',
                'DELETE /users/:id': 'Видалити користувача (каскадне видалення коментарів)'
            },
            comments: {
                'POST /comments': 'Створити коментар',
                'GET /comments': 'Отримати всі коментарі (search: ?search=keyword, pagination: ?page=1&limit=10)',
                'GET /comments/user/:id': 'Отримати коментарі користувача',
                'PUT /comments/:id': 'Оновити коментар',
                'DELETE /comments/:id': 'Видалити коментар'
            }
        }
    });
});

// API маршрути
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// =====================================================
// Обробка помилок
// =====================================================

app.use(notFound);
app.use(errorHandler);

// =====================================================
// Запуск сервера
// =====================================================

app.listen(PORT, () => {
    console.log(`\n╔═══════════════════════════════════════╗`);
    console.log(`║   Users & Comments API - Running     ║`);
    console.log(`╚═══════════════════════════════════════╝`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📚 Docs:   http://localhost:${PORT}/`);
    console.log(`💊 Health: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Закриття сервера...');
    await mongoose.connection.close();
    console.log('✅ З\'єднання з MongoDB закрито');
    process.exit(0);
});
