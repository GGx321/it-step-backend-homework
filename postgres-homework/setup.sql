-- Створення бази даних та таблиці користувачів

-- Створити базу даних (виконати окремо)
-- CREATE DATABASE homework_db;

-- Підключитися до бази даних
-- \c homework_db

-- Створення таблиці users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Додавання тестових даних
INSERT INTO users (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@gmail.com'),
    ('Charlie', 'charlie@example.com'),
    ('David', 'david@yahoo.com'),
    ('Anna', 'anna@example.com')
ON CONFLICT (email) DO NOTHING;

-- Перевірка даних
SELECT * FROM users ORDER BY id;
