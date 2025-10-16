# PostgreSQL Homework - Node.js

Домашнє завдання з роботи з PostgreSQL через Node.js з використанням пакету `pg`.

---

## 📁 Структура проекту

```
postgres-homework/
├── index.js              # Основний файл з усіма завданнями
├── db.js                 # Підключення до PostgreSQL
├── setup.sql             # SQL скрипт для створення таблиці
├── config.example.js     # Приклад конфігурації БД
├── package.json          # Залежності Node.js
└── README.md             # Ця інструкція
```

---

## 🚀 Встановлення та налаштування

### 1. Встановлення PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Створення бази даних

```bash
# Підключення до PostgreSQL
psql -U postgres

# Створення бази даних
CREATE DATABASE homework_db;

# Вихід
\q
```

### 3. Налаштування проекту

```bash
# Встановлення залежностей
npm install

# Копіювання конфігурації
cp config.example.js config.js

# Редагування config.js (вкажіть свої дані)
```

**config.js:**
```javascript
module.exports = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'your_password',
    database: 'homework_db'
};
```

### 4. Створення таблиці та даних

```bash
# Виконання SQL скрипта
psql -U postgres -d homework_db -f setup.sql

# Або через npm
npm run setup
```

---

## 📝 Завдання

### ✅ Завдання 1: Імена у верхньому регістрі

**Функція:** `getUserNamesUpper()`

**SQL запит:**
```sql
SELECT UPPER(name) AS username FROM users;
```

**Результат:**
```javascript
['ALICE', 'BOB', 'CHARLIE', 'DAVID', 'ANNA']
```

---

### ✅ Завдання 2: Email містить літеру "a"

**Функція:** `findUsersWithA()`

**SQL запит:**
```sql
SELECT name, email 
FROM users 
WHERE email LIKE '%a%'
ORDER BY name;
```

**Результат:**
```
Alice — alice@example.com
Anna — anna@example.com
Charlie — charlie@example.com
David — david@yahoo.com
```

---

### ✅ Завдання 3: Кількість користувачів по доменах

**Функція:** `countByDomain()`

**SQL запит:**
```sql
SELECT 
    SPLIT_PART(email, '@', 2) AS domain, 
    COUNT(*) AS count
FROM users 
GROUP BY domain
ORDER BY count DESC;
```

**Результат:**
```
example.com — 3
gmail.com — 1
yahoo.com — 1
```

---

### ✅ Завдання 4: Користувачі за порядком створення

**Функція:** `getUsersOrdered()`

**SQL запит:**
```sql
SELECT 
    name, 
    email, 
    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at
FROM users 
ORDER BY created_at ASC;
```

**Результат:**
```javascript
[
  {
    name: 'Alice',
    email: 'alice@example.com',
    created_at: '2025-10-16 17:00:00'
  },
  {
    name: 'Bob',
    email: 'bob@gmail.com',
    created_at: '2025-10-16 17:00:01'
  },
  // ...
]
```

---

### ✅ Завдання 5: Оновлення імені за email

**Функція:** `renameUserByEmail(email, newName)`

**SQL запити:**
```sql
-- Перевірка існування
SELECT * FROM users WHERE email = $1;

-- Оновлення
UPDATE users 
SET name = $1 
WHERE email = $2 
RETURNING *;
```

**Приклади:**
```javascript
// Успішне оновлення
await renameUserByEmail('bob@gmail.com', 'Robert');
// ✅ Ім'я користувача оновлено: bob@gmail.com → Robert

// Користувач не знайдений
await renameUserByEmail('nonexistent@email.com', 'Test');
// ❌ Користувача з email "nonexistent@email.com" не знайдено
```

---

## 🎯 Запуск

```bash
# Запуск усіх завдань
npm start

# Або напряму
node index.js
```

**Очікуваний вивід:**
```
╔════════════════════════════════════════╗
║   PostgreSQL Homework - Node.js App   ║
╚════════════════════════════════════════╝

✅ Підключено до PostgreSQL

👥 Всі користувачі в базі даних
================================
┌─────────┬────┬──────────┬─────────────────────────┬──────────────────────────┐
│ (index) │ id │   name   │          email          │       created_at         │
├─────────┼────┼──────────┼─────────────────────────┼──────────────────────────┤
│    0    │ 1  │ 'Alice'  │ 'alice@example.com'     │ 2025-10-16T14:00:00.000Z │
│    1    │ 2  │ 'Bob'    │ 'bob@gmail.com'         │ 2025-10-16T14:00:01.000Z │
│    2    │ 3  │ 'Charlie'│ 'charlie@example.com'   │ 2025-10-16T14:00:02.000Z │
│    3    │ 4  │ 'David'  │ 'david@yahoo.com'       │ 2025-10-16T14:00:03.000Z │
│    4    │ 5  │ 'Anna'   │ 'anna@example.com'      │ 2025-10-16T14:00:04.000Z │
└─────────┴────┴──────────┴─────────────────────────┴──────────────────────────┘

📝 Завдання 1: Імена у верхньому регістрі
=====================================
['ALICE', 'BOB', 'CHARLIE', 'DAVID', 'ANNA']

📧 Завдання 2: Email містить літеру "a"
=====================================
Alice — alice@example.com
Anna — anna@example.com
Charlie — charlie@example.com
David — david@yahoo.com

🌐 Завдання 3: Кількість по доменах
=====================================
example.com — 3
gmail.com — 1
yahoo.com — 1

📅 Завдання 4: Користувачі за порядком створення
================================================
{ name: 'Alice', email: 'alice@example.com', created_at: '2025-10-16 17:00:00' }
{ name: 'Bob', email: 'bob@gmail.com', created_at: '2025-10-16 17:00:01' }
{ name: 'Charlie', email: 'charlie@example.com', created_at: '2025-10-16 17:00:02' }
{ name: 'David', email: 'david@yahoo.com', created_at: '2025-10-16 17:00:03' }
{ name: 'Anna', email: 'anna@example.com', created_at: '2025-10-16 17:00:04' }

✅ Ім'я користувача оновлено:
   Email: bob@gmail.com
   Нове ім'я: Robert

❌ Користувача з email "nonexistent@email.com" не знайдено

✨ Всі завдання виконано!
👋 З'єднання з базою даних закрито
```

---

## 📚 Використані SQL функції

### Робота з рядками:
- `UPPER()` - перетворення в верхній регістр
- `LIKE '%a%'` - пошук підрядка
- `SPLIT_PART(email, '@', 2)` - розділення рядка

### Агрегація та групування:
- `COUNT(*)` - підрахунок записів
- `GROUP BY` - групування по полю
- `ORDER BY` - сортування

### Форматування дати:
- `TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS')` - форматування дати

### Параметризовані запити:
- `$1, $2` - placeholder для захисту від SQL injection

---

## 🔧 Додаткові функції

### `showAllUsers()`
Показує всіх користувачів у вигляді таблиці.

### `resetDatabase()`
Скидає базу даних до початкового стану.

**Використання:**
```javascript
const { showAllUsers, resetDatabase } = require('./index');

// Показати користувачів
await showAllUsers();

// Скинути БД
await resetDatabase();
```

---

## 🛠 Корисні команди PostgreSQL

```bash
# Підключення до БД
psql -U postgres -d homework_db

# Показати таблиці
\dt

# Показати структуру таблиці
\d users

# Виконати запит
SELECT * FROM users;

# Вихід
\q
```

---

## 📊 Результати виконання

- ✅ **Завдання 1** - `UPPER()` для перетворення імен
- ✅ **Завдання 2** - `LIKE` для пошуку в email
- ✅ **Завдання 3** - `SPLIT_PART()` + `GROUP BY` для доменів
- ✅ **Завдання 4** - `ORDER BY created_at` для сортування
- ✅ **Завдання 5** - `UPDATE` з перевіркою існування

---

## 🎓 Що вивчено

### Node.js + PostgreSQL:
- Підключення до БД через пакет `pg`
- Connection Pool для ефективної роботи
- Async/await для асинхронних запитів
- Параметризовані запити ($1, $2)

### SQL концепції:
- Робота з рядками (UPPER, LIKE, SPLIT_PART)
- Агрегація (COUNT, GROUP BY)
- Сортування (ORDER BY)
- Форматування дати (TO_CHAR)
- Оновлення з перевіркою (UPDATE + SELECT)

### Best Practices:
- Захист від SQL injection
- Обробка помилок (try/catch)
- Закриття з'єднань (pool.end())
- Валідація даних перед оновленням

---

**Всі завдання виконано! ✨**
