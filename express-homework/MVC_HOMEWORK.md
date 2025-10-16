# Express MVC Homework - Повна документація

## 🏗 Архітектура MVC

Проект організовано за патерном **Model-View-Controller** з чіткою структурою файлів.

---

## 📁 Структура проекту

```
src/
├── controllers/              # Контролери (бізнес-логіка)
│   ├── productController.js
│   ├── orderController.js
│   └── dashboardController.js
├── routes/
│   └── api/                  # API маршрути з префіксом /api
│       ├── products.js
│       ├── orders.js
│       └── dashboard.js
├── middleware/               # Middleware
│   ├── requestLogger.js      # Логування запитів
│   └── authMiddleware.js     # Авторизація
├── views/                    # EJS шаблони
│   ├── layout.ejs            # Головний layout
│   ├── partials/
│   │   └── navbar-mvc.ejs
│   ├── products-list.ejs
│   ├── product-detail.ejs
│   ├── search-products.ejs
│   ├── orders-list.ejs
│   ├── order-detail.ejs
│   └── dashboard-stats.ejs
└── app.js                    # Головний файл
```

---

## ✅ Завдання 1: Сторінка товарів

### Контролер: `productController.js`
- `getAllProducts()` - список товарів
- `getProductById()` - деталі товару
- `searchProducts()` - пошук товарів

### Маршрути:
- `GET /api/products?auth=true` - всі товари
- `GET /api/products/:id?auth=true` - товар за ID
- `GET /api/products/search?auth=true&name=...` - пошук

### Валідація:
- ✅ Товар не знайдено → повідомлення
- ✅ Порожній список → повідомлення
- ✅ Немає результатів пошуку → повідомлення

**Тестування:**
```bash
# Список товарів (потрібен auth=true)
http://localhost:5001/api/products?auth=true

# Деталі товару
http://localhost:5001/api/products/1?auth=true

# Пошук
http://localhost:5001/api/products/search?auth=true&name=ноутбук
```

---

## ✅ Завдання 2: CRUD для замовлень

### Контролер: `orderController.js`
- `getOrders()` - список замовлень
- `getOrderById()` - деталі замовлення
- `createOrder()` - створення замовлення
- `deleteOrder()` - видалення замовлення

### Маршрути:
- `GET /api/orders` - всі замовлення
- `GET /api/orders/:id` - замовлення за ID
- `POST /api/orders` - створити замовлення
- `GET /api/orders/delete/:id` - видалити замовлення

**Тестування:**
```bash
# Список замовлень
http://localhost:5001/api/orders

# Створити замовлення (через форму на сторінці)
# Видалити замовлення (кнопка на сторінці)
```

---

## ✅ Завдання 3: Middleware для логування

### Файл: `middleware/requestLogger.js`

Логує кожен запит у форматі:
```
[2025-10-16 16:50:15] GET /api/products
[2025-10-16 16:50:20] POST /api/orders
```

Підключено глобально в `app.js`:
```javascript
app.use(requestLogger);
```

---

## ✅ Завдання 4: Групування Router-ів (prefix routes)

Всі MVC маршрути знаходяться в `routes/api/` з префіксом `/api`:

```javascript
app.use('/api/products', apiProductsRoutes);
app.use('/api/orders', apiOrdersRoutes);
app.use('/api/dashboard', apiDashboardRoutes);
```

---

## ✅ Завдання 5: Dashboard з кількома контролерами

### Контролер: `dashboardController.js`
- `getStats()` - статистика системи
- `getReport()` - текстовий звіт

### Маршрути:
- `GET /api/dashboard/stats` - статистика
- `GET /api/dashboard/report` - звіт

**Тестування:**
```bash
http://localhost:5001/api/dashboard/stats
http://localhost:5001/api/dashboard/report
```

---

## ✅ Завдання 6: Layout із кількома секціями

### Файл: `views/layout.ejs`

Структура:
- **Header** - шапка сайту
- **Navbar** - навігація
- **Main** - основний контент (змінна `body`)
- **Sidebar** - бічна панель (змінна `sidebar`)
- **Footer** - підвал

Кожен шаблон передає свій контент:
```javascript
const body = `<h2>Контент</h2>`;
const sidebar = `<p>Sidebar</p>`;
<%- include('layout', { body, sidebar, title: 'Заголовок' }) %>
```

---

## ✅ Завдання 7 (БОНУС): Router-level middleware

### Файл: `middleware/authMiddleware.js`

Перевіряє параметр `?auth=true` для доступу до товарів:

```javascript
// У routes/api/products.js
router.use(authMiddleware);
```

**Без авторизації:**
```
Доступ заборонено. Додайте ?auth=true до URL
```

**З авторизацією:**
```
http://localhost:5001/api/products?auth=true
```

---

## 🎯 Виконані критерії

### Основні:
- ✅ Окремі router і controller для продуктів
- ✅ Вивід через EJS (таблиця + детальна сторінка)
- ✅ Пошук через query параметри
- ✅ Partials для навігації
- ✅ Обробка помилок (немає товару, немає результатів)

### Додаткові:
- ✅ Повний CRUD для замовлень
- ✅ Middleware для логування
- ✅ Структуризація через префікси (/api)
- ✅ Кілька контролерів (products, orders, dashboard)
- ✅ Layout з header, main, sidebar, footer
- ✅ Router-level middleware (авторизація)

---

## 🚀 Запуск

```bash
cd express-homework
npm start
```

**Сервер:** http://localhost:5001

---

## 🔗 Основні посилання

### Товари (потрібен auth=true):
- http://localhost:5001/api/products?auth=true
- http://localhost:5001/api/products/1?auth=true
- http://localhost:5001/api/products/search?auth=true&name=мишка

### Замовлення:
- http://localhost:5001/api/orders
- http://localhost:5001/api/orders/1

### Dashboard:
- http://localhost:5001/api/dashboard/stats
- http://localhost:5001/api/dashboard/report

### Інші:
- http://localhost:5001/ - Головна
- http://localhost:5001/products - EJS товари
- http://localhost:5001/comments - EJS коментарі

---

## 📊 Особливості реалізації

### 1. MVC Pattern
- **Model** - дані в контролерах (масиви в пам'яті)
- **View** - EJS шаблони
- **Controller** - бізнес-логіка

### 2. Middleware
- `requestLogger` - логування всіх запитів
- `authMiddleware` - перевірка auth=true
- `express.urlencoded` - парсинг форм

### 3. Layout System
- Єдиний layout для всіх сторінок
- Динамічний sidebar
- Responsive дизайн

### 4. Error Handling
- Валідація параметрів
- Повідомлення про помилки
- 404 для неіснуючих ресурсів

---

## 🎓 Що вивчено

- ✅ MVC архітектура
- ✅ Контролери та роутери
- ✅ Middleware (глобальний та router-level)
- ✅ EJS Layout System
- ✅ CRUD операції
- ✅ Валідація та обробка помилок
- ✅ Структуризація коду
- ✅ Префікси маршрутів

---

**Всі завдання виконано! 🎉**
