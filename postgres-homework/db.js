const { Pool } = require('pg');

// Конфігурація підключення до PostgreSQL
// Створіть файл config.js на основі config.example.js
let config;
try {
    config = require('./config');
} catch (error) {
    // Якщо config.js не існує, використовуємо конфігурацію за замовчуванням
    config = {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'homework_db'
    };
    console.warn('⚠️  config.js не знайдено. Використовуємо конфігурацію за замовчуванням.');
    console.warn('   Створіть config.js на основі config.example.js для налаштування.');
}

// Створення пулу з'єднань
const pool = new Pool(config);

// Перевірка підключення
pool.on('connect', () => {
    console.log('✅ Підключено до PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Помилка підключення до PostgreSQL:', err);
});

module.exports = pool;
