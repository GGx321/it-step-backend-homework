# Express "Books & Users" API

Полнофункциональный REST API для управления книгами и пользователями с использованием Express.js.

## 🚀 Возможности

- ✅ CRUD операции для книг и пользователей
- ✅ Фильтрация и пагинация
- ✅ Валидация данных
- ✅ Защита API ключом
- ✅ Логирование запросов
- ✅ Обработка ошибок
- ✅ Rate limiting (60 запросов за 5 минут)
- ✅ Рекомендации книг (бонус)

## 📁 Структура проекта

```
express-homework/
├── package.json
├── src/
│   ├── app.js                  # Главный файл приложения
│   ├── routes/
│   │   ├── books.routes.js     # Маршруты для книг
│   │   └── users.routes.js     # Маршруты для пользователей
│   ├── middleware/
│   │   ├── logger.js           # Логирование запросов
│   │   ├── requireApiKey.js    # Проверка API ключа
│   │   ├── errorHandler.js     # Обработка ошибок
│   │   └── validation.js       # Валидация данных
│   └── data/
│       ├── books.js            # Данные книг (в памяти)
│       └── users.js            # Данные пользователей (в памяти)
```

## 🛠 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск сервера
npm start

# Запуск в режиме разработки (с автоперезагрузкой)
npm run dev
```

Сервер запустится на `http://localhost:5001`

## 📚 API Endpoints

### Books API (`/api/books`)

#### GET /api/books
Получить список книг с поддержкой фильтрации и пагинации.

**Query параметры:**
- `q` - поиск по названию (частичное совпадение, case-insensitive)
- `page` - номер страницы (по умолчанию: 1)
- `limit` - количество записей на странице (по умолчанию: 5)

**Примеры:**
```bash
# Все книги (первая страница)
curl http://localhost:5001/api/books

# Поиск книг с "node" в названии
curl "http://localhost:5001/api/books?q=node"

# Пагинация
curl "http://localhost:5001/api/books?page=2&limit=3"

# Комбинированный запрос
curl "http://localhost:5001/api/books?q=node&page=1&limit=3"
```

**Ответ:**
```json
{
  "data": [...],
  "page": 1,
  "limit": 5,
  "total": 10
}
```

#### GET /api/books/:id
Получить книгу по ID.

```bash
curl http://localhost:5001/api/books/1
```

**Ответ (200):**
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert Martin",
  "price": 25.5
}
```

**Ошибка (404):**
```json
{
  "error": "Not Found",
  "message": "Book not found"
}
```

#### POST /api/books
Создать новую книгу.

**Тело запроса:**
```json
{
  "title": "New Book",
  "author": "Author Name",
  "price": 29.99
}
```

**Валидация:**
- `title` - обязательно, строка, минимум 2 символа
- `author` - обязательно, непустая строка
- `price` - обязательно, число > 0

**Пример:**
```bash
curl -X POST http://localhost:5001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author","price":19.99}'
```

**Ответ (201):**
```json
{
  "id": 11,
  "title": "Test Book",
  "author": "Test Author",
  "price": 19.99
}
```

**Ошибка валидации (400):**
```json
{
  "error": "ValidationError",
  "details": ["Title must be a string with at least 2 characters"]
}
```

#### PUT /api/books/:id
Обновить книгу (частично или полностью).

```bash
curl -X PUT http://localhost:5001/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"price":27.99}'
```

#### DELETE /api/books/:id
Удалить книгу.

```bash
curl -X DELETE http://localhost:5001/api/books/1
```

**Ответ (204):** Нет содержимого

#### GET /api/books/:id/recommendations (БОНУС)
Получить 3 похожие книги.

```bash
curl http://localhost:5001/api/books/3/recommendations
```

**Ответ:**
```json
{
  "book": "Node.js Design Patterns",
  "recommendations": [...]
}
```

---

### Users API (`/api/users`)

⚠️ **Все маршруты требуют API ключ в заголовке:**
```
x-api-key: SECRET123
```

#### GET /api/users
Получить список пользователей.

**Query параметры:**
- `role` - фильтр по роли (admin, user, moderator)

**Примеры:**
```bash
# Все пользователи
curl http://localhost:5001/api/users \
  -H "x-api-key: SECRET123"

# Только администраторы
curl "http://localhost:5001/api/users?role=admin" \
  -H "x-api-key: SECRET123"
```

**Без API ключа (401):**
```json
{
  "error": "Unauthorized",
  "message": "Valid API key required"
}
```

#### GET /api/users/:id
Получить пользователя по ID.

```bash
curl http://localhost:5001/api/users/1 \
  -H "x-api-key: SECRET123"
```

#### POST /api/users
Создать нового пользователя.

**Тело запроса:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "role": "user"
}
```

**Валидация:**
- `name` - обязательно, непустая строка
- `email` - обязательно, должен содержать @
- `role` - опционально (по умолчанию: "user")

**Пример:**
```bash
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: SECRET123" \
  -d '{"name":"New User","email":"user@example.com"}'
```

#### PUT /api/users/:id
Обновить пользователя.

```bash
curl -X PUT http://localhost:5001/api/users/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: SECRET123" \
  -d '{"role":"admin"}'
```

#### DELETE /api/users/:id
Удалить пользователя.

```bash
curl -X DELETE http://localhost:5001/api/users/1 \
  -H "x-api-key: SECRET123"
```

---

## 🔧 Middleware

### Logger
Логирует каждый запрос в формате:
```
[2025-10-16T14:32:18.015Z] GET /api/books 200 - 5ms
```

### API Key Protection
Проверяет наличие заголовка `x-api-key: SECRET123` для всех маршрутов `/api/users/*`.

### Validation
Валидирует тело запроса для POST и PUT операций.

### Error Handler
Глобальный обработчик ошибок, возвращает JSON с информацией об ошибке.

### Rate Limiting (БОНУС)
Ограничивает количество запросов до 60 в течение 5 минут с одного IP.

**Ответ при превышении лимита (429):**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again later."
}
```

---

## 📊 Статус-коды

- `200` - Успешный запрос
- `201` - Ресурс создан
- `204` - Успешно, нет содержимого
- `400` - Ошибка валидации
- `401` - Не авторизован (нет API ключа)
- `404` - Ресурс не найден
- `429` - Слишком много запросов
- `500` - Внутренняя ошибка сервера

---

## 🧪 Тестирование

### Health Check
```bash
curl http://localhost:5001/health
```

**Ответ:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-16T14:32:18.015Z"
}
```

### Примеры полного тестирования

```bash
# 1. Получить все книги
curl http://localhost:5001/api/books

# 2. Поиск книг
curl "http://localhost:5001/api/books?q=node&page=1&limit=3"

# 3. Создать книгу
curl -X POST http://localhost:5001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"New Book","author":"Author","price":25.5}'

# 4. Получить пользователей (с API ключом)
curl http://localhost:5001/api/users \
  -H "x-api-key: SECRET123"

# 5. Фильтр пользователей по роли
curl "http://localhost:5001/api/users?role=admin" \
  -H "x-api-key: SECRET123"

# 6. Создать пользователя
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: SECRET123" \
  -d '{"name":"Test User","email":"test@example.com"}'

# 7. Получить рекомендации книг
curl http://localhost:5001/api/books/3/recommendations

# 8. Тест 404
curl http://localhost:5001/api/unknown
```

---

## ✅ Выполненные требования

### Обязательные:
- ✅ Структура проекта соответствует требованиям
- ✅ Установлен Express и настроены скрипты
- ✅ Используется `express.json()`
- ✅ Отдельные роутеры для books и users
- ✅ Фильтрация по `q` и пагинация для книг
- ✅ Валидация тела запроса (POST/PUT)
- ✅ Middleware логирования
- ✅ Middleware `requireApiKey` для `/api/users/*`
- ✅ Глобальный `errorHandler`
- ✅ Корректные статус-коды (201, 404, 400, 500)

### Бонусные:
- ✅ Rate limiting (60 запросов за 5 минут)
- ✅ GET `/api/books/:id/recommendations`
- ✅ Кастомная 404 для API в формате JSON

---

## 🎓 Что изучено

- Создание REST API на Express
- Роутинг и модульная структура
- Middleware (логирование, аутентификация, валидация)
- Обработка ошибок
- Query параметры и пагинация
- Валидация данных
- Rate limiting
- HTTP статус-коды
- JSON API best practices
