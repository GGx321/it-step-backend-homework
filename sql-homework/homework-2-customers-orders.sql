-- =====================================================
-- Домашнє завдання 2: Customers & Orders (JOIN, Агрегати)
-- =====================================================

-- Завдання 1. Створення таблиць
-- =====================================================

-- Таблиця клієнтів
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL
);

-- Таблиця замовлень
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    amount INT NOT NULL,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Завдання 2. Наповнення даними
-- =====================================================

-- Додаємо клієнтів
INSERT INTO customers (full_name, city) VALUES
    ('Іван Петренко', 'Київ'),
    ('Марія Коваленко', 'Львів'),
    ('Олександр Шевченко', 'Одеса'),
    ('Анна Бондаренко', 'Київ'),
    ('Дмитро Мельник', 'Харків');

-- Додаємо замовлення
INSERT INTO orders (order_date, amount, customer_id) VALUES
    -- Іван Петренко (id=1) - 3 замовлення
    ('2025-01-15', 1500, 1),
    ('2025-02-20', 2500, 1),
    ('2025-03-10', 800, 1),
    
    -- Марія Коваленко (id=2) - 2 замовлення
    ('2025-01-25', 3200, 2),
    ('2025-03-05', 1800, 2),
    
    -- Олександр Шевченко (id=3) - 1 замовлення
    ('2025-02-10', 5000, 3),
    
    -- Анна Бондаренко (id=4) - 0 замовлень (немає записів)
    
    -- Дмитро Мельник (id=5) - 2 замовлення
    ('2025-01-05', 900, 5),
    ('2025-03-15', 1200, 5);

-- Перевірка даних
SELECT * FROM customers;
SELECT * FROM orders;

-- Завдання 3. JOIN
-- =====================================================

-- 3.1. Список усіх замовлень із іменами клієнтів (INNER JOIN)
SELECT 
    o.id AS order_id,
    o.order_date,
    o.amount,
    c.full_name AS customer_name,
    c.city
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
ORDER BY o.order_date;

-- 3.2. Всі клієнти навіть без замовлень (LEFT JOIN)
SELECT 
    c.id AS customer_id,
    c.full_name,
    c.city,
    o.id AS order_id,
    o.order_date,
    o.amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
ORDER BY c.id, o.order_date;

-- 3.3. Клієнти без замовлень
SELECT 
    c.id,
    c.full_name,
    c.city
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- Завдання 4. Агрегати
-- =====================================================

-- 4.1. Загальна кількість замовлень
SELECT COUNT(*) AS total_orders
FROM orders;

-- 4.2. Сума замовлень по кожному клієнту
SELECT 
    c.id,
    c.full_name,
    c.city,
    COUNT(o.id) AS orders_count,
    COALESCE(SUM(o.amount), 0) AS total_amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.full_name, c.city
ORDER BY total_amount DESC;

-- 4.3. Середня сума замовлення
SELECT 
    ROUND(AVG(amount), 2) AS average_order_amount
FROM orders;

-- Додаткова статистика
SELECT 
    MIN(amount) AS min_order,
    MAX(amount) AS max_order,
    AVG(amount) AS avg_order,
    SUM(amount) AS total_revenue
FROM orders;

-- Завдання 5. GROUP BY + ORDER BY
-- =====================================================

-- 5.1. Міста та кількість клієнтів у кожному місті
SELECT 
    city,
    COUNT(*) AS customers_count
FROM customers
GROUP BY city
ORDER BY customers_count DESC, city;

-- 5.2. Міста з загальною сумою замовлень
SELECT 
    c.city,
    COUNT(DISTINCT c.id) AS customers_count,
    COUNT(o.id) AS orders_count,
    COALESCE(SUM(o.amount), 0) AS total_revenue
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.city
ORDER BY total_revenue DESC;

-- Завдання 6. Аналітичне завдання
-- =====================================================

/*
ВІДПОВІДЬ:

Додавання статусів замовлень:

1. Зміна таблиці orders:
*/

-- Додаємо колонку status
ALTER TABLE orders 
ADD COLUMN status VARCHAR(20) DEFAULT 'pending' 
CHECK (status IN ('pending', 'completed', 'cancelled'));

-- Оновлюємо існуючі замовлення (приклад)
UPDATE orders SET status = 'completed' WHERE order_date < '2025-02-01';
UPDATE orders SET status = 'pending' WHERE order_date >= '2025-03-01';
UPDATE orders SET status = 'cancelled' WHERE amount < 1000 AND order_date < '2025-02-01';

/*
2. Запити для роботи зі статусами:
*/

-- Кількість замовлень по статусах
SELECT 
    status,
    COUNT(*) AS count,
    SUM(amount) AS total_amount
FROM orders
GROUP BY status
ORDER BY count DESC;

-- Кількість "completed" замовлень у кожного клієнта
SELECT 
    c.id,
    c.full_name,
    c.city,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) AS completed_orders,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) AS pending_orders,
    COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) AS cancelled_orders,
    COUNT(o.id) AS total_orders
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.full_name, c.city
ORDER BY completed_orders DESC;

-- Сума completed замовлень по клієнтах
SELECT 
    c.full_name,
    COUNT(o.id) AS completed_orders_count,
    COALESCE(SUM(o.amount), 0) AS completed_revenue
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
GROUP BY c.id, c.full_name
HAVING COUNT(o.id) > 0
ORDER BY completed_revenue DESC;

-- Статистика по містах та статусах
SELECT 
    c.city,
    o.status,
    COUNT(o.id) AS orders_count,
    SUM(o.amount) AS total_amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
GROUP BY c.city, o.status
ORDER BY c.city, o.status;

-- Клієнти з найбільшою кількістю completed замовлень
SELECT 
    c.full_name,
    c.city,
    COUNT(o.id) AS completed_orders,
    SUM(o.amount) AS total_spent
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.id, c.full_name, c.city
ORDER BY completed_orders DESC, total_spent DESC
LIMIT 5;

-- Конверсія замовлень (відсоток completed від загальної кількості)
SELECT 
    c.full_name,
    COUNT(o.id) AS total_orders,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) AS completed_orders,
    ROUND(
        COUNT(CASE WHEN o.status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(o.id), 0), 
        2
    ) AS completion_rate_percent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.full_name
HAVING COUNT(o.id) > 0
ORDER BY completion_rate_percent DESC;

/*
3. Додаткові корисні поля для orders:

- payment_method VARCHAR(20) - спосіб оплати (card, cash, online)
- delivery_address TEXT - адреса доставки
- notes TEXT - примітки до замовлення
- updated_at TIMESTAMP - дата останнього оновлення
- completed_at TIMESTAMP - дата завершення замовлення
*/

-- Розширена версія таблиці orders
CREATE TABLE orders_extended (
    id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    amount INT NOT NULL,
    customer_id INT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    payment_method VARCHAR(20),
    delivery_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
