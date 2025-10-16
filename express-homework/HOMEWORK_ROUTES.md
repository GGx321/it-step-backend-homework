# Домашнє завдання - Додаткові маршрути

## 📍 Нові маршрути

Всі нові маршрути додані до існуючого сервера на порту **5001**.

---

## Завдання 1: Params — профіль користувача

### GET /profile/:username

Повертає привітання з ім'ям користувача.

**Приклади:**

```bash
# Профіль Nick
curl http://localhost:5001/profile/Nick
# Відповідь: Welcome to profile of Nick

# Профіль Anna
curl http://localhost:5001/profile/Anna
# Відповідь: Welcome to profile of Anna

# Профіль з кирилицею
curl http://localhost:5001/profile/Олександр
# Відповідь: Welcome to profile of Олександр
```

---

## Завдання 2: Query — пошук курсів

### GET /courses

Повертає список курсів або фільтрує за параметрами.

**Query параметри:**
- `topic` - тема курсу
- `level` - рівень складності

**Приклади:**

```bash
# Всі доступні курси
curl http://localhost:5001/courses

# Відповідь:
{
  "message": "Available courses",
  "courses": [
    {"id": 1, "topic": "JavaScript", "level": "beginner"},
    {"id": 2, "topic": "Node.js", "level": "intermediate"},
    {"id": 3, "topic": "React", "level": "advanced"},
    {"id": 4, "topic": "Express", "level": "intermediate"},
    {"id": 5, "topic": "MongoDB", "level": "beginner"}
  ]
}

# Курси з конкретною темою та рівнем
curl "http://localhost:5001/courses?topic=JavaScript&level=beginner"
# Відповідь: Showing courses on JavaScript for beginner level.

# Тільки тема
curl "http://localhost:5001/courses?topic=Node.js"
# Відповідь: Showing courses on Node.js.

# Тільки рівень
curl "http://localhost:5001/courses?level=advanced"
# Відповідь: Showing courses for advanced level.
```

---

## Завдання 3: Body — реєстрація користувача

### POST /register

Реєструє нового користувача.

**Тіло запиту (JSON):**
```json
{
  "email": "test@mail.com",
  "password": "12345"
}
```

**Приклади:**

```bash
# Успішна реєстрація
curl -X POST http://localhost:5001/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com","password":"12345"}'

# Відповідь (200):
{
  "status": "registered",
  "email": "test@mail.com"
}

# Реєстрація з іншим email
curl -X POST http://localhost:5001/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"qwerty"}'

# Відповідь (200):
{
  "status": "registered",
  "email": "user@example.com"
}

# Помилка валідації - відсутні дані
curl -X POST http://localhost:5001/register \
  -H "Content-Type: application/json" \
  -d '{}'

# Відповідь (400):
{
  "error": "ValidationError",
  "message": "Email and password are required"
}
```

---

## Завдання 4: Міні-API для задач (TODO)

### POST /tasks

Додає нову задачу.

**Тіло запиту (JSON):**
```json
{
  "title": "Назва задачі"
}
```

**Приклади:**

```bash
# Додати задачу
curl -X POST http://localhost:5001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Express"}'

# Відповідь (201):
{
  "id": 1,
  "title": "Learn Express",
  "createdAt": "2025-10-16T14:39:49.182Z"
}

# Додати ще задачі
curl -X POST http://localhost:5001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Build REST API"}'

curl -X POST http://localhost:5001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js"}'

# Помилка валідації
curl -X POST http://localhost:5001/tasks \
  -H "Content-Type: application/json" \
  -d '{}'

# Відповідь (400):
{
  "error": "ValidationError",
  "message": "Title is required"
}
```

---

### GET /tasks

Повертає всі задачі.

**Приклад:**

```bash
curl http://localhost:5001/tasks

# Відповідь:
{
  "total": 3,
  "tasks": [
    {
      "id": 1,
      "title": "Learn Express",
      "createdAt": "2025-10-16T14:39:49.182Z"
    },
    {
      "id": 2,
      "title": "Build REST API",
      "createdAt": "2025-10-16T14:39:59.010Z"
    },
    {
      "id": 3,
      "title": "Learn Node.js",
      "createdAt": "2025-10-16T14:39:59.023Z"
    }
  ]
}
```

---

### GET /tasks/:id

Повертає задачу за ID.

**Приклади:**

```bash
# Отримати задачу з ID = 1
curl http://localhost:5001/tasks/1

# Відповідь (200):
{
  "id": 1,
  "title": "Learn Express",
  "createdAt": "2025-10-16T14:39:49.182Z"
}

# Задача не знайдена
curl http://localhost:5001/tasks/999

# Відповідь (404):
{
  "error": "Not Found",
  "message": "Task not found"
}
```

---

### GET /tasks/search?title=...

Шукає задачі за частковим збігом у назві (case-insensitive).

**Query параметри:**
- `title` - текст для пошуку

**Приклади:**

```bash
# Пошук задач зі словом "Learn"
curl "http://localhost:5001/tasks/search?title=Learn"

# Відповідь:
{
  "query": "Learn",
  "found": 2,
  "tasks": [
    {
      "id": 1,
      "title": "Learn Express",
      "createdAt": "2025-10-16T14:39:49.182Z"
    },
    {
      "id": 3,
      "title": "Learn Node.js",
      "createdAt": "2025-10-16T14:39:59.023Z"
    }
  ]
}

# Пошук зі словом "API"
curl "http://localhost:5001/tasks/search?title=API"

# Відповідь:
{
  "query": "API",
  "found": 1,
  "tasks": [
    {
      "id": 2,
      "title": "Build REST API",
      "createdAt": "2025-10-16T14:39:59.010Z"
    }
  ]
}

# Пошук без результатів
curl "http://localhost:5001/tasks/search?title=Python"

# Відповідь:
{
  "query": "Python",
  "found": 0,
  "tasks": []
}

# Помилка - відсутній параметр
curl "http://localhost:5001/tasks/search"

# Відповідь (400):
{
  "error": "ValidationError",
  "message": "Search query \"title\" is required"
}
```

---

## 📂 Структура файлів

Нові маршрути знаходяться в папці `src/routes/homework/`:

```
src/routes/homework/
├── profile.routes.js    # GET /profile/:username
├── courses.routes.js    # GET /courses
├── register.routes.js   # POST /register
└── tasks.routes.js      # CRUD для /tasks
```

---

## 🚀 Запуск

```bash
# Запуск сервера
cd express-homework
npm start

# Або в режимі розробки
npm run dev
```

Сервер доступний на: **http://localhost:5001**

---

## 📊 Повний список маршрутів

### Основні API (з попереднього завдання):
- `GET /health` - Health check
- `GET /api/books` - Книги з пагінацією
- `GET /api/users` - Користувачі (потрібен API ключ)

### Нові маршрути (домашнє завдання):
- `GET /profile/:username` - Профіль користувача
- `GET /courses` - Курси з фільтрацією
- `POST /register` - Реєстрація
- `POST /tasks` - Створити задачу
- `GET /tasks` - Всі задачі
- `GET /tasks/:id` - Задача за ID
- `GET /tasks/search?title=...` - Пошук задач

---

## ✅ Виконані вимоги

- ✅ **Завдання 1**: Params - профіль користувача
- ✅ **Завдання 2**: Query - пошук курсів з фільтрацією
- ✅ **Завдання 3**: Body - реєстрація користувача
- ✅ **Завдання 4**: Міні-API для задач (TODO) з повним CRUD та пошуком
