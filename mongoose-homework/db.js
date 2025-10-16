const mongoose = require('mongoose');

// URL підключення до MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homework_db';

// Підключення до MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Підключено до MongoDB');
        console.log(`📦 База даних: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ Помилка підключення до MongoDB:', error.message);
        process.exit(1);
    }
}

// Відключення від MongoDB
async function disconnectDB() {
    try {
        await mongoose.connection.close();
        console.log('\n👋 З\'єднання з MongoDB закрито');
    } catch (error) {
        console.error('Помилка при закритті з\'єднання:', error.message);
    }
}

// Очищення бази даних (для тестування)
async function clearDB() {
    try {
        await mongoose.connection.dropDatabase();
        console.log('🗑️  База даних очищена');
    } catch (error) {
        console.error('Помилка при очищенні БД:', error.message);
    }
}

module.exports = {
    connectDB,
    disconnectDB,
    clearDB
};
