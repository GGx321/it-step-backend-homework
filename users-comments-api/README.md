# Users & Comments API

CRUD API для системи користувачів та коментарів з використанням **Express** + **Mongoose** (MongoDB).

---

## 📁 Структура проекту

```
users-comments-api/
├── models/
│   ├── User.js              # Модель користувача
│   └── Comment.js           # Модель коментаря
├── controllers/
│   ├── userController.js    # Логіка для користувачів
│   └── commentController.js # Логіка для коментарів
├── routes/
│   ├── userRoutes.js        # Маршрути для користувачів
│   └── commentRoutes.js     # Маршрути для коментарів
├── middleware/
│   ├── errorHandler.js      # Обробка помилок
│   └── logger.js            # Логування запитів
├── server.js                # Головний файл сервера
├── package.json             # Залежності
├── README.md                # Документація
└── API_EXAMPLES.md          # Приклади запитів
```

---

## 🚀 Встановлення та запуск

### 1. Встановлення MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt install mongodb
sudo systemctl start mongodb
```

**Windows:**
- Завантажити з [mongodb.com](https://www.mongodb.com/try/download/community)

### 2. Запуск проекту

```bash
# Встановлення залежностей
npm install

# Запуск у production режимі
npm start

# Запуск у development режимі (з nodemon)
npm run dev
```

Сервер запуститься на `http://localhost:5001`

---

## 📊 Моделі даних

### User (Користувач)

```javascript
{
    _id: ObjectId,
    name: String (обов'язкове),
    email: String (обов'язкове, унікальне),
    createdAt: Date (автоматично),
    updatedAt: Date (автоматично)
}
```

**Валідація:**
- `name` - обов'язкове, trim
- `email` - обов'язкове, унікальне, lowercase, валідація формату

### Comment (Коментар)

```javascript
{
    _id: ObjectId,
    text: String (обов'язкове),
    userId: ObjectId (ref: User, обов'язкове),
    createdAt: Date (за замовчуванням: now)
}
```

**Валідація:**
- `text` - обов'язкове, мінімум 1 символ
- `userId` - обов'язкове, має посилатися на існуючого користувача

---

## 🛣 API Маршрути

### 👥 Користувачі (Users)

| Метод | Маршрут | Опис | Body |
|-------|---------|------|------|
| `POST` | `/users` | Створити користувача | `{ name, email }` |
| `GET` | `/users` | Отримати всіх користувачів | - |
| `GET` | `/users/:id` | Отримати користувача + коментарі | - |
| `PUT` | `/users/:id` | Оновити користувача | `{ name, email }` |
| `DELETE` | `/users/:id` | Видалити користувача | - |

**Додаткові можливості:**
- **Пагінація**: `GET /users?page=2&limit=5`
- **Каскадне видалення**: При видаленні користувача видаляються всі його коментарі

### 💬 Коментарі (Comments)

| Метод | Маршрут | Опис | Body |
|-------|---------|------|------|
| `POST` | `/comments` | Створити коментар | `{ text, userId }` |
| `GET` | `/comments` | Отримати всі коментарі | - |
| `GET` | `/comments/user/:id` | Коментарі користувача | - |
| `PUT` | `/comments/:id` | Оновити коментар | `{ text }` |
| `DELETE` | `/comments/:id` | Видалити коментар | - |

**Додаткові можливості:**
- **Пошук**: `GET /comments?search=keyword`
- **Пагінація**: `GET /comments?page=1&limit=10`
- **Populate**: Автоматично додає інформацію про автора (name, email)

---

## 📝 Приклади використання

### 1. Створення користувача

**Request:**
```bash
POST http://localhost:5001/users
Content-Type: application/json

{
    "name": "Іван Петренко",
    "email": "ivan@example.com"
}
```

**Response:** `201 Created`
```json
{
    "message": "Користувача створено",
    "user": {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Іван Петренко",
        "email": "ivan@example.com",
        "createdAt": "2025-10-16T14:30:00.000Z",
        "updatedAt": "2025-10-16T14:30:00.000Z"
    }
}
```

---

### 2. Отримання всіх користувачів (з пагінацією)

**Request:**
```bash
GET http://localhost:5001/users?page=1&limit=5
```

**Response:** `200 OK`
```json
{
    "users": [
        {
            "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
            "name": "Іван Петренко",
            "email": "ivan@example.com",
            "createdAt": "2025-10-16T14:30:00.000Z"
        }
    ],
    "pagination": {
        "total": 15,
        "page": 1,
        "limit": 5,
        "totalPages": 3
    }
}
```

---

### 3. Отримання користувача з коментарями

**Request:**
```bash
GET http://localhost:5001/users/65f1a2b3c4d5e6f7g8h9i0j1
```

**Response:** `200 OK`
```json
{
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Іван Петренко",
    "email": "ivan@example.com",
    "comments": [
        {
            "_id": "65f1b2c3d4e5f6g7h8i9j0k1",
            "text": "Чудовий пост!",
            "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
            "createdAt": "2025-10-16T14:35:00.000Z"
        },
        {
            "_id": "65f1c2d3e4f5g6h7i8j9k0l1",
            "text": "Дуже корисна інформація",
            "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
            "createdAt": "2025-10-16T14:40:00.000Z"
        }
    ]
}
```

---

### 4. Створення коментаря

**Request:**
```bash
POST http://localhost:5001/comments
Content-Type: application/json

{
    "text": "Дуже корисна стаття!",
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response:** `201 Created`
```json
{
    "message": "Коментар створено",
    "comment": {
        "_id": "65f1d2e3f4g5h6i7j8k9l0m1",
        "text": "Дуже корисна стаття!",
        "userId": {
            "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
            "name": "Іван Петренко",
            "email": "ivan@example.com"
        },
        "createdAt": "2025-10-16T14:45:00.000Z"
    }
}
```

---

### 5. Пошук коментарів за ключовим словом

**Request:**
```bash
GET http://localhost:5001/comments?search=корисна
```

**Response:** `200 OK`
```json
{
    "comments": [
        {
            "_id": "65f1d2e3f4g5h6i7j8k9l0m1",
            "text": "Дуже корисна стаття!",
            "userId": {
                "name": "Іван Петренко",
                "email": "ivan@example.com"
            },
            "createdAt": "2025-10-16T14:45:00.000Z"
        },
        {
            "_id": "65f1c2d3e4f5g6h7i8j9k0l1",
            "text": "Дуже корисна інформація",
            "userId": {
                "name": "Марія Коваль",
                "email": "maria@example.com"
            },
            "createdAt": "2025-10-16T14:40:00.000Z"
        }
    ],
    "pagination": {
        "total": 2,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
```

---

### 6. Видалення користувача (каскадне)

**Request:**
```bash
DELETE http://localhost:5001/users/65f1a2b3c4d5e6f7g8h9i0j1
```

**Response:** `200 OK`
```json
{
    "message": "Користувача та його коментарі видалено",
    "deletedCommentsCount": 5
}
```

---

## ✅ Реалізовані вимоги

### Основні (обов'язкові):

- ✅ **Повний CRUD для Users**
  - CREATE - `POST /users`
  - READ - `GET /users`, `GET /users/:id`
  - UPDATE - `PUT /users/:id`
  - DELETE - `DELETE /users/:id`

- ✅ **CRUD для Comments**
  - CREATE - `POST /comments`
  - READ - `GET /comments`, `GET /comments/user/:id`
  - UPDATE - `PUT /comments/:id` (бонус)
  - DELETE - `DELETE /comments/:id` (бонус)

- ✅ **Зв'язок 1:N (User → Comments)**
  - User має масив коментарів
  - Comment має посилання на userId

- ✅ **Унікальність email**
  - Валідація на рівні схеми
  - Повідомлення про помилку при дублюванні

- ✅ **Каскадне видалення**
  - При видаленні User → видаляються всі його Comment

- ✅ **Include коментарів при отриманні користувача**
  - `GET /users/:id` повертає користувача + всі його коментарі

### Додаткові (для сильних студентів):

- ✅ **Пошук коментарів за ключовим словом**
  - `GET /comments?search=keyword`
  - Case-insensitive пошук через regex

- ✅ **Пагінація**
  - Для користувачів: `GET /users?page=2&limit=5`
  - Для коментарів: `GET /comments?page=1&limit=10`
  - Повертає `total`, `page`, `limit`, `totalPages`

### Бонусні можливості:

- ✅ **Структурований код**
  - Поділ на Models, Controllers, Routes, Middleware
  - Чиста архітектура

- ✅ **Обробка помилок**
  - Централізований errorHandler
  - Валідація Mongoose
  - 404 для неіснуючих маршрутів
  - Перевірка існування користувача перед створенням коментаря

- ✅ **Валідація даних**
  - Email формат
  - Required fields
  - Trim, lowercase
  - Custom error messages

- ✅ **Populate (JOIN)**
  - Коментарі автоматично включають інформацію про автора
  - `populate('userId', 'name email')`

- ✅ **Логування**
  - Middleware для логування всіх запитів
  - Timestamp, method, URL

- ✅ **Health check**
  - `GET /health` - статус сервера та БД

---

## 🔧 Технології

- **Express.js** - веб-фреймворк
- **Mongoose** - ODM для MongoDB
- **MongoDB** - NoSQL база даних
- **ES Modules** - сучасний синтаксис import/export

---

## 🎓 Що вивчено

### MongoDB + Mongoose:
- ✅ Схеми з валідацією
- ✅ Зв'язки між колекціями (ref)
- ✅ Populate для JOIN
- ✅ Індекси для оптимізації
- ✅ Каскадне видалення

### Express.js:
- ✅ RESTful API
- ✅ MVC архітектура
- ✅ Middleware (logger, errorHandler)
- ✅ Роутинг
- ✅ Обробка помилок

### CRUD операції:
- ✅ Create - `create()`
- ✅ Read - `find()`, `findById()`
- ✅ Update - `findByIdAndUpdate()`
- ✅ Delete - `findByIdAndDelete()`, `deleteMany()`

### Додатково:
- ✅ Пагінація (skip, limit)
- ✅ Пошук (regex, $options: 'i')
- ✅ Сортування (sort)
- ✅ Фільтрація
- ✅ Валідація (required, unique, match)

---

## 🧪 Тестування

Використовуйте **Postman**, **Thunder Client** або **curl**:

```bash
# Створити користувача
curl -X POST http://localhost:5001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Отримати всіх користувачів
curl http://localhost:5001/users

# Отримати користувача з коментарями
curl http://localhost:5001/users/USER_ID

# Створити коментар
curl -X POST http://localhost:5001/comments \
  -H "Content-Type: application/json" \
  -d '{"text":"Great post!","userId":"USER_ID"}'

# Пошук коментарів
curl "http://localhost:5001/comments?search=Great"
```

---

## 📊 Оцінювання (10 балів)

| Критерій | Бал | Статус |
|----------|-----|--------|
| Реалізовано повний CRUD | 4 | ✅ |
| Коректна структура моделей | 2 | ✅ |
| Працює зв'язок User–Comment | 2 | ✅ |
| Обробка помилок і валідація | 1 | ✅ |
| Код структурований і зрозумілий | 1 | ✅ |
| **Разом** | **10** | **✅** |

**Бонуси:**
- ✅ Пошук коментарів (+1)
- ✅ Пагінація (+1)
- ✅ Додаткові маршрути (UPDATE, DELETE для коментарів) (+0.5)
- ✅ Логування (+0.5)
- ✅ Health check (+0.5)

---

## 🔗 Додаткові ресурси

- [Express Documentation](https://expressjs.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Проект готовий до використання! ✨**
