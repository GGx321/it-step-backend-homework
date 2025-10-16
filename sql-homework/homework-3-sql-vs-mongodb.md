# Домашнє завдання 3: SQL vs MongoDB

Порівняння реляційних та NoSQL баз даних на прикладах.

---

## Завдання 1: Проєктування блог-платформи

### 🗄 SQL - Реляційна модель (PostgreSQL)

#### Таблиці:

**1. users (Користувачі)**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. posts (Пости)**
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    published_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**3. comments (Коментарі)**
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id INT,  -- для вкладених коментарів
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
```

**4. tags (Теги)**
```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**5. post_tags (Зв'язок постів та тегів - Many-to-Many)**
```sql
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

**Переваги SQL моделі:**
- ✅ Нормалізація даних (без дублювання)
- ✅ Строга типізація
- ✅ ACID гарантії
- ✅ Складні JOIN запити
- ✅ Легко підтримувати цілісність даних

---

### 📄 MongoDB - Документна модель

#### Колекція: posts

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Введення в MongoDB",
  "content": "MongoDB - це документо-орієнтована NoSQL база даних...",
  "slug": "introduction-to-mongodb",
  "status": "published",
  
  // Вбудована інформація про автора
  "author": {
    "id": ObjectId("507f191e810c19729de860ea"),
    "username": "john_doe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "https://example.com/avatars/john.jpg"
  },
  
  // Масив тегів
  "tags": [
    { "name": "MongoDB", "slug": "mongodb" },
    { "name": "NoSQL", "slug": "nosql" },
    { "name": "Databases", "slug": "databases" }
  ],
  
  // Вбудовані коментарі
  "comments": [
    {
      "_id": ObjectId("507f1f77bcf86cd799439012"),
      "user": {
        "id": ObjectId("507f191e810c19729de860eb"),
        "username": "jane_smith",
        "full_name": "Jane Smith"
      },
      "content": "Дуже корисна стаття!",
      "created_at": ISODate("2025-03-15T10:30:00Z"),
      "replies": [
        {
          "_id": ObjectId("507f1f77bcf86cd799439013"),
          "user": {
            "id": ObjectId("507f191e810c19729de860ea"),
            "username": "john_doe",
            "full_name": "John Doe"
          },
          "content": "Дякую!",
          "created_at": ISODate("2025-03-15T11:00:00Z")
        }
      ]
    },
    {
      "_id": ObjectId("507f1f77bcf86cd799439014"),
      "user": {
        "id": ObjectId("507f191e810c19729de860ec"),
        "username": "alex_brown",
        "full_name": "Alex Brown"
      },
      "content": "Чудове пояснення концепцій!",
      "created_at": ISODate("2025-03-16T09:15:00Z"),
      "replies": []
    }
  ],
  
  // Метадані
  "views_count": 1523,
  "likes_count": 45,
  "published_at": ISODate("2025-03-10T14:00:00Z"),
  "created_at": ISODate("2025-03-08T10:00:00Z"),
  "updated_at": ISODate("2025-03-10T13:55:00Z")
}
```

**Переваги MongoDB моделі:**
- ✅ Всі дані поста в одному документі
- ✅ Швидке читання (один запит)
- ✅ Гнучка схема
- ✅ Легко масштабувати горизонтально
- ✅ Природна робота з JSON

---

## Завдання 2: Порівняння запитів

### 📊 SQL (PostgreSQL)

```sql
-- Всі опубліковані пости після 2025-01-01
SELECT 
    p.id,
    p.title,
    p.content,
    p.published_at,
    u.username AS author_username,
    u.full_name AS author_name,
    p.views_count
FROM posts p
INNER JOIN users u ON p.author_id = u.id
WHERE p.published_at > '2025-01-01'
  AND p.status = 'published'
ORDER BY p.published_at DESC;

-- З тегами (більш складний запит)
SELECT 
    p.id,
    p.title,
    p.published_at,
    u.username,
    ARRAY_AGG(t.name) AS tags
FROM posts p
INNER JOIN users u ON p.author_id = u.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.published_at > '2025-01-01'
  AND p.status = 'published'
GROUP BY p.id, p.title, p.published_at, u.username
ORDER BY p.published_at DESC;

-- З кількістю коментарів
SELECT 
    p.id,
    p.title,
    p.published_at,
    u.username,
    COUNT(c.id) AS comments_count
FROM posts p
INNER JOIN users u ON p.author_id = u.id
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.published_at > '2025-01-01'
  AND p.status = 'published'
GROUP BY p.id, p.title, p.published_at, u.username
ORDER BY p.published_at DESC;
```

### 📄 MongoDB

```javascript
// Простий запит
db.posts.find({
  published_at: { $gt: ISODate("2025-01-01T00:00:00Z") },
  status: "published"
}).sort({ published_at: -1 });

// З проекцією (вибірка полів)
db.posts.find(
  {
    published_at: { $gt: ISODate("2025-01-01T00:00:00Z") },
    status: "published"
  },
  {
    title: 1,
    "author.username": 1,
    "author.full_name": 1,
    tags: 1,
    published_at: 1,
    views_count: 1
  }
).sort({ published_at: -1 });

// З кількістю коментарів (aggregation)
db.posts.aggregate([
  {
    $match: {
      published_at: { $gt: ISODate("2025-01-01T00:00:00Z") },
      status: "published"
    }
  },
  {
    $addFields: {
      comments_count: { $size: "$comments" }
    }
  },
  {
    $project: {
      title: 1,
      "author.username": 1,
      published_at: 1,
      views_count: 1,
      comments_count: 1
    }
  },
  {
    $sort: { published_at: -1 }
  }
]);

// Пошук по тегах
db.posts.find({
  published_at: { $gt: ISODate("2025-01-01T00:00:00Z") },
  status: "published",
  "tags.slug": "mongodb"
}).sort({ published_at: -1 });
```

**Порівняння:**
- SQL: Потрібні JOIN для зв'язку таблиць
- MongoDB: Всі дані в одному документі, простіші запити
- SQL: Більш складні запити, але строга структура
- MongoDB: Швидше читання, але можливе дублювання даних

---

## Завдання 3: Робота з вкладеними структурами

### 📄 MongoDB - Запити до вкладених даних

#### Дані:
```javascript
{
  "order_id": 101,
  "user": { 
    "name": "Olena", 
    "email": "olena@example.com" 
  },
  "items": [
    { "product": "Phone", "price": 800 },
    { "product": "Case", "price": 20 }
  ],
  "total": 820,
  "status": "completed",
  "created_at": ISODate("2025-03-15T10:00:00Z")
}
```

#### Запити:

```javascript
// 1. Знайти всі замовлення з товаром "Phone"
db.orders.find({
  "items.product": "Phone"
});

// 2. Знайти замовлення з товаром "Phone" та ціною > 500
db.orders.find({
  "items": {
    $elemMatch: {
      product: "Phone",
      price: { $gt: 500 }
    }
  }
});

// 3. Знайти замовлення користувача Olena
db.orders.find({
  "user.name": "Olena"
});

// 4. Знайти замовлення з Phone та отримати тільки цей товар
db.orders.aggregate([
  { $match: { "items.product": "Phone" } },
  { $unwind: "$items" },
  { $match: { "items.product": "Phone" } },
  {
    $project: {
      order_id: 1,
      "user.name": 1,
      item: "$items",
      total: 1
    }
  }
]);

// 5. Підрахувати загальну суму всіх Phone
db.orders.aggregate([
  { $unwind: "$items" },
  { $match: { "items.product": "Phone" } },
  {
    $group: {
      _id: null,
      total_phones: { $sum: 1 },
      total_revenue: { $sum: "$items.price" }
    }
  }
]);
```

### 🗄 SQL - Еквівалентна структура

#### Таблиці:

```sql
-- Таблиця користувачів
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Таблиця замовлень
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id INT UNIQUE NOT NULL,
    user_id INT NOT NULL,
    total DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Таблиця товарів замовлення
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### Додавання даних:

```sql
-- Додати користувача
INSERT INTO users (name, email) VALUES ('Olena', 'olena@example.com');

-- Додати замовлення
INSERT INTO orders (order_id, user_id, total, status) 
VALUES (101, 1, 820.00, 'completed');

-- Додати товари
INSERT INTO order_items (order_id, product, price) VALUES
    (1, 'Phone', 800.00),
    (1, 'Case', 20.00);
```

#### SQL запити (еквівалент MongoDB):

```sql
-- 1. Знайти всі замовлення з товаром "Phone"
SELECT DISTINCT 
    o.order_id,
    u.name,
    u.email,
    o.total,
    o.status
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN order_items oi ON o.id = oi.order_id
WHERE oi.product = 'Phone';

-- 2. Замовлення з Phone ціною > 500
SELECT o.*, u.name, u.email
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN order_items oi ON o.id = oi.order_id
WHERE oi.product = 'Phone' AND oi.price > 500;

-- 3. Замовлення користувача Olena
SELECT o.*, u.name
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE u.name = 'Olena';

-- 4. Деталі замовлень з Phone
SELECT 
    o.order_id,
    u.name,
    oi.product,
    oi.price,
    o.total
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN order_items oi ON o.id = oi.order_id
WHERE oi.product = 'Phone';

-- 5. Підрахунок Phone
SELECT 
    COUNT(*) AS total_phones,
    SUM(oi.price) AS total_revenue
FROM order_items oi
WHERE oi.product = 'Phone';

-- 6. Повна інформація про замовлення (з агрегацією товарів)
SELECT 
    o.order_id,
    u.name,
    u.email,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'product', oi.product,
            'price', oi.price,
            'quantity', oi.quantity
        )
    ) AS items,
    o.total,
    o.status
FROM orders o
INNER JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_id, u.name, u.email, o.total, o.status;
```

**Порівняння підходів:**

| Аспект | MongoDB | SQL |
|--------|---------|-----|
| Структура | Вкладені документи | Окремі таблиці з JOIN |
| Запити | Простіші для вкладених даних | Більш складні JOIN |
| Продуктивність | Швидше читання | Швидше оновлення |
| Масштабування | Горизонтальне | Вертикальне |
| Цілісність | Відповідальність програміста | Автоматична через FK |

---

## Завдання 4: Вибір підходу

### 1️⃣ CRM-система для компанії (клієнти, угоди, рахунки)

**Вибір: SQL (PostgreSQL)**

**Чому:**
- ✅ **ACID транзакції** - критично для фінансових операцій
- ✅ **Строгі зв'язки** - клієнти, угоди, рахунки тісно пов'язані
- ✅ **Цілісність даних** - Foreign Keys гарантують коректність
- ✅ **Складні звіти** - JOIN, GROUP BY для аналітики
- ✅ **Нормалізація** - немає дублювання даних
- ✅ **Історія змін** - легко реалізувати аудит

**Приклад структури:**
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200),
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id),
    amount DECIMAL(12, 2),
    status VARCHAR(20),
    probability INT,
    expected_close_date DATE
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    deal_id INT REFERENCES deals(id),
    invoice_number VARCHAR(50) UNIQUE,
    amount DECIMAL(12, 2),
    paid BOOLEAN DEFAULT false,
    due_date DATE
);
```

---

### 2️⃣ Система логування кліків (мільйони подій щосекунди)

**Вибір: MongoDB або Cassandra**

**Чому:**
- ✅ **Швидкий запис** - оптимізовано для write-heavy операцій
- ✅ **Горизонтальне масштабування** - легко додавати сервери
- ✅ **Гнучка схема** - різні типи подій
- ✅ **Sharding** - розподіл даних по серверах
- ✅ **Time-series** - оптимізація для часових даних
- ✅ **Немає JOIN** - прості та швидкі запити

**Приклад документа (MongoDB):**
```javascript
{
  "_id": ObjectId("..."),
  "event_type": "click",
  "timestamp": ISODate("2025-03-20T15:30:45.123Z"),
  "user": {
    "id": "user_12345",
    "session_id": "sess_abc123",
    "ip": "192.168.1.1"
  },
  "element": {
    "id": "btn-submit",
    "type": "button",
    "text": "Submit",
    "url": "/checkout"
  },
  "page": {
    "url": "/products/phone",
    "title": "Phone Product Page",
    "referrer": "https://google.com"
  },
  "device": {
    "type": "mobile",
    "os": "iOS",
    "browser": "Safari"
  }
}
```

**Індекси:**
```javascript
db.events.createIndex({ timestamp: -1 });
db.events.createIndex({ "user.id": 1, timestamp: -1 });
db.events.createIndex({ "page.url": 1, timestamp: -1 });
```

**Альтернатива:** ClickHouse, TimescaleDB - спеціалізовані для аналітики

---

### 3️⃣ Онлайн-гра з чатами в реальному часі

**Вибір: Гібридний підхід**

**Основна БД: SQL (PostgreSQL)**
**Для чату: MongoDB або Redis**

**Чому SQL для гри:**
- ✅ **Цілісність** - ігрові баланси, інвентар, досягнення
- ✅ **ACID** - критично для транзакцій (покупки, обміни)
- ✅ **Складні запити** - рейтинги, статистика

**Чому NoSQL для чату:**
- ✅ **Швидкість** - мільйони повідомлень
- ✅ **Real-time** - оптимізовано для streaming
- ✅ **Масштабування** - багато каналів одночасно
- ✅ **TTL** - автоматичне видалення старих повідомлень

**Архітектура:**

```javascript
// MongoDB - чат повідомлення
{
  "_id": ObjectId("..."),
  "channel_id": "global_chat",
  "user": {
    "id": 12345,
    "username": "Player123",
    "level": 45
  },
  "message": "Hi everyone!",
  "timestamp": ISODate("2025-03-20T15:30:00Z"),
  "expires_at": ISODate("2025-03-27T15:30:00Z") // TTL 7 днів
}

// SQL - ігрові дані
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    gold INT DEFAULT 100,
    created_at TIMESTAMP
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    item_id INT,
    quantity INT,
    acquired_at TIMESTAMP
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    achievement_type VARCHAR(50),
    unlocked_at TIMESTAMP
);
```

**Додатково: Redis для:**
- 🚀 Кеш активних гравців
- 🚀 Лідерборди (sorted sets)
- 🚀 Сесії онлайн

---

## 📊 Підсумкова таблиця порівняння

| Критерій | SQL | MongoDB |
|----------|-----|---------|
| **Структура даних** | Таблиці, рядки | Документи, колекції |
| **Схема** | Строга | Гнучка |
| **Зв'язки** | FK, JOIN | Вбудовані документи |
| **Транзакції** | ACID | Eventual consistency |
| **Масштабування** | Вертикальне | Горизонтальне |
| **Запити** | SQL | JavaScript/JSON |
| **Використання** | Фінанси, CRM | Логи, чати, каталоги |

---

**Висновок:**
- **SQL** - для критичних даних з складними зв'язками
- **NoSQL** - для великих обсягів, швидкого запису, гнучкості
- **Гібрид** - найкраще з обох світів для складних систем


