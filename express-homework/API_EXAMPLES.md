# Примеры API запросов

## Быстрый старт

```bash
# Запуск сервера
npm start

# Сервер доступен на http://localhost:5001
```

## Books API (без авторизации)

```bash
# Получить все книги
curl http://localhost:5001/api/books

# Поиск книг по названию
curl "http://localhost:5001/api/books?q=node"

# Пагинация
curl "http://localhost:5001/api/books?page=2&limit=3"

# Комбинированный запрос
curl "http://localhost:5001/api/books?q=express&page=1&limit=2"

# Получить книгу по ID
curl http://localhost:5001/api/books/1

# Создать книгу
curl -X POST http://localhost:5001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"My New Book","author":"John Doe","price":29.99}'

# Обновить книгу
curl -X PUT http://localhost:5001/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"price":35.99}'

# Удалить книгу
curl -X DELETE http://localhost:5001/api/books/11

# Получить рекомендации (БОНУС)
curl http://localhost:5001/api/books/3/recommendations
```

## Users API (требуется API ключ)

**API Key:** `x-api-key: SECRET123`

```bash
# Получить всех пользователей
curl http://localhost:5001/api/users \
  -H "x-api-key: SECRET123"

# Фильтр по роли
curl "http://localhost:5001/api/users?role=admin" \
  -H "x-api-key: SECRET123"

# Получить пользователя по ID
curl http://localhost:5001/api/users/1 \
  -H "x-api-key: SECRET123"

# Создать пользователя
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: SECRET123" \
  -d '{"name":"New User","email":"newuser@example.com","role":"user"}'

# Обновить пользователя
curl -X PUT http://localhost:5001/api/users/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: SECRET123" \
  -d '{"role":"moderator"}'

# Удалить пользователя
curl -X DELETE http://localhost:5001/api/users/6 \
  -H "x-api-key: SECRET123"
```

## Тесты валидации

```bash
# Ошибка валидации - короткое название
curl -X POST http://localhost:5001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"A","author":"Test","price":10}'

# Ошибка валидации - отрицательная цена
curl -X POST http://localhost:5001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test","price":-5}'

# Ошибка валидации - неправильный email
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: SECRET123" \
  -d '{"name":"Test","email":"invalidemail"}'

# Ошибка - нет API ключа
curl http://localhost:5001/api/users

# Ошибка - неправильный API ключ
curl http://localhost:5001/api/users \
  -H "x-api-key: WRONG_KEY"
```

## Тесты ошибок

```bash
# 404 - книга не найдена
curl http://localhost:5001/api/books/999

# 404 - пользователь не найден
curl http://localhost:5001/api/users/999 \
  -H "x-api-key: SECRET123"

# 404 - несуществующий эндпоинт
curl http://localhost:5001/api/unknown
```

## Health Check

```bash
curl http://localhost:5001/health
```
