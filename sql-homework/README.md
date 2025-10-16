# SQL Homework - PostgreSQL

Домашні завдання з SQL для роботи з PostgreSQL.

---

## 📁 Структура файлів

```
sql-homework/
├── homework-1-courses.sql           # Завдання 1: Таблиця courses
├── homework-2-customers-orders.sql  # Завдання 2: Customers & Orders
└── README.md                        # Ця інструкція
```

---

## 🗄 Домашнє завдання 1: Таблиця Courses

### Файл: `homework-1-courses.sql`

### Завдання:
1. ✅ Створення таблиці `courses` (id, title, duration, price)
2. ✅ Додавання 4 курсів (безкоштовний, дорогий, 2 звичайних)
3. ✅ Вибірка з умовами (безкоштовні, дорожчі 2000, знижка 20%)
4. ✅ Оновлення тривалості курсу
5. ✅ Видалення дешевих курсів (< 500 грн)
6. ✅ Аналітика: додаткові поля для платформи

### Додаткові поля (Завдання 6):
- `instructor_name` - ім'я викладача
- `students_count` - кількість студентів
- `rating` - рейтинг курсу (0-5)
- `category` - категорія курсу
- `start_date` - дата початку
- `is_active` - чи активний курс

### Запуск:
```bash
# Підключення до PostgreSQL
psql -U your_username -d your_database

# Виконання скрипта
\i homework-1-courses.sql

# Або через командний рядок
psql -U your_username -d your_database -f homework-1-courses.sql
```

---

## 🗄 Домашнє завдання 2: Customers & Orders

### Файл: `homework-2-customers-orders.sql`

### Завдання:
1. ✅ Створення таблиць `customers` та `orders` з зв'язком
2. ✅ Додавання 5 клієнтів та 8 замовлень
3. ✅ JOIN запити (INNER JOIN, LEFT JOIN)
4. ✅ Агрегатні функції (COUNT, SUM, AVG)
5. ✅ GROUP BY + ORDER BY (статистика по містах)
6. ✅ Аналітика: додавання статусів замовлень

### Структура даних:

**Customers:**
- Іван Петренко (Київ) - 3 замовлення
- Марія Коваленко (Львів) - 2 замовлення
- Олександр Шевченко (Одеса) - 1 замовлення
- Анна Бондаренко (Київ) - 0 замовлень
- Дмитро Мельник (Харків) - 2 замовлення

**Orders:**
- Різні дати, суми від 800 до 5000 грн
- Статуси: pending, completed, cancelled

### Запуск:
```bash
# Підключення до PostgreSQL
psql -U your_username -d your_database

# Виконання скрипта
\i homework-2-customers-orders.sql

# Або через командний рядок
psql -U your_username -d your_database -f homework-2-customers-orders.sql
```

---

## 📊 Основні SQL запити

### Homework 1: Courses

```sql
-- Створення таблиці
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    duration INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Безкоштовні курси
SELECT * FROM courses WHERE price = 0;

-- Курси дорожчі 2000 грн
SELECT * FROM courses WHERE price > 2000;

-- Знижка 20%
SELECT title, price, ROUND(price * 0.8, 2) AS discounted_price
FROM courses;
```

### Homework 2: Customers & Orders

```sql
-- INNER JOIN - замовлення з клієнтами
SELECT o.*, c.full_name, c.city
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- LEFT JOIN - всі клієнти (навіть без замовлень)
SELECT c.*, o.id AS order_id, o.amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- Сума замовлень по клієнтах
SELECT c.full_name, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.full_name;

-- Статистика по містах
SELECT city, COUNT(*) AS customers_count
FROM customers
GROUP BY city
ORDER BY customers_count DESC;
```

---

## 🎯 Ключові концепції

### Завдання 1:
- ✅ CREATE TABLE з різними типами даних
- ✅ INSERT для додавання даних
- ✅ SELECT з умовами WHERE
- ✅ Обчислення в SELECT (знижки)
- ✅ UPDATE для зміни даних
- ✅ DELETE з умовами
- ✅ Проектування БД (додаткові поля)

### Завдання 2:
- ✅ FOREIGN KEY для зв'язків між таблицями
- ✅ INNER JOIN для об'єднання таблиць
- ✅ LEFT JOIN для включення всіх записів
- ✅ Агрегатні функції (COUNT, SUM, AVG)
- ✅ GROUP BY для групування
- ✅ ORDER BY для сортування
- ✅ COALESCE для обробки NULL
- ✅ CASE WHEN для умовної логіки

---

## 💡 Корисні запити

### Статистика курсів:
```sql
-- Топ курсів за рейтингом
SELECT title, rating, students_count
FROM courses_extended
WHERE is_active = true
ORDER BY rating DESC
LIMIT 5;

-- Курси по категоріях
SELECT category, COUNT(*) as count, AVG(rating) as avg_rating
FROM courses_extended
GROUP BY category;
```

### Статистика замовлень:
```sql
-- Кількість completed замовлень по клієнтах
SELECT c.full_name, COUNT(o.id) AS completed_orders
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.id, c.full_name;

-- Конверсія замовлень
SELECT 
    full_name,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*) AS completion_rate
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, full_name;
```

---

## 🔧 Налаштування PostgreSQL

### Встановлення (macOS):
```bash
brew install postgresql
brew services start postgresql
```

### Створення бази даних:
```bash
createdb homework_db
```

### Підключення:
```bash
psql homework_db
```

### Корисні команди psql:
```sql
\l              -- список баз даних
\dt             -- список таблиць
\d table_name   -- структура таблиці
\q              -- вихід
```

---

## 📈 Результати виконання

### Homework 1:
- ✅ Таблиця courses створена
- ✅ 4 курси додано
- ✅ Запити на вибірку працюють
- ✅ Оновлення та видалення виконані
- ✅ Запропоновано 6 додаткових полів

### Homework 2:
- ✅ 2 таблиці з зв'язком створені
- ✅ 5 клієнтів та 8 замовлень додано
- ✅ JOIN запити працюють
- ✅ Агрегатні функції виконуються
- ✅ Групування та сортування працює
- ✅ Додано статуси замовлень з запитами

---

## 🎓 Що вивчено

### Основи SQL:
- CREATE TABLE
- INSERT, SELECT, UPDATE, DELETE
- WHERE, ORDER BY
- Типи даних (SERIAL, VARCHAR, INT, DECIMAL, DATE)

### Просунуті концепції:
- PRIMARY KEY, FOREIGN KEY
- INNER JOIN, LEFT JOIN
- Агрегатні функції (COUNT, SUM, AVG, MIN, MAX)
- GROUP BY, HAVING
- COALESCE, CASE WHEN
- CHECK constraints
- ON DELETE CASCADE

---

**Всі завдання виконано! 🎉**
