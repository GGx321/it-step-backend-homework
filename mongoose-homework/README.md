# Mongoose Homework - Article CRUD

Домашнє завдання з роботи з MongoDB через Mongoose. Реалізація CRUD операцій для моделі Article з дефолтними значеннями, пошуком, оновленням та сортуванням.

---

## 📁 Структура проекту

```
mongoose-homework/
├── models/
│   └── Article.js        # Mongoose модель Article
├── index.js              # Основний файл з усіма завданнями
├── db.js                 # Підключення до MongoDB
├── package.json          # Залежності
└── README.md             # Документація
```

---

## 🚀 Встановлення та налаштування

### 1. Встановлення MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

**Windows:**
- Завантажити з [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Встановити та запустити як службу

### 2. Перевірка MongoDB

```bash
# Перевірка статусу
mongosh

# У mongosh консолі:
show dbs
exit
```

### 3. Налаштування проекту

```bash
# Встановлення залежностей
npm install

# Запуск
npm start
```

---

## 📝 Завдання

### ✅ Завдання 1: Схема з дефолтними значеннями

**Модель Article:**
```javascript
{
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    likes: {
        type: Number,
        default: 0,           // 👈 Дефолтне значення
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now     // 👈 Дефолтне значення
    }
}
```

**Створення статей БЕЗ вказання `likes` та `createdAt`:**

```javascript
await Article.create({
    title: 'Введення в MongoDB',
    body: 'MongoDB - це документо-орієнтована NoSQL база даних...'
    // likes та createdAt встановляться автоматично!
});
```

**Результат:**
```javascript
{
    _id: ObjectId("..."),
    title: 'Введення в MongoDB',
    body: 'MongoDB - це документо-орієнтована NoSQL база даних...',
    likes: 0,                           // ✅ Дефолт
    createdAt: 2025-10-16T14:30:00.000Z // ✅ Дефолт
}
```

---

### ✅ Завдання 2: Пошук по кількох умовах

**Функція:** `findPopularArticles(minLikes, keyword)`

**Реалізація:**
```javascript
async function findPopularArticles(minLikes, keyword) {
    return await Article.find({
        likes: { $gte: minLikes },                    // likes >= minLikes
        title: { $regex: keyword, $options: 'i' }    // title містить keyword
    });
}
```

**Приклади використання:**
```javascript
// Знайти статті з >= 10 лайків, які містять "Node"
await findPopularArticles(10, 'Node');
// Результат: REST API Best Practices, Node.js та Express

// Знайти всі статті про MongoDB
await findPopularArticles(0, 'MongoDB');
// Результат: Введення в MongoDB, MongoDB для початківців
```

**MongoDB запит:**
```javascript
db.articles.find({
    likes: { $gte: 10 },
    title: { $regex: /Node/i }
})
```

---

### ✅ Завдання 3: Оновлення з інкрементом

**Функція:** `likeArticle(id)`

**Реалізація:**
```javascript
async function likeArticle(id) {
    return await Article.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },  // 👈 Збільшуємо на 1
        { new: true }            // Повертаємо оновлений документ
    );
}
```

**Приклад:**
```javascript
const article = await Article.findOne({ title: 'Введення в MongoDB' });
console.log(article.likes); // 0

await likeArticle(article._id);
console.log(article.likes); // 1

await likeArticle(article._id);
console.log(article.likes); // 2
```

**MongoDB запит:**
```javascript
db.articles.updateOne(
    { _id: ObjectId("...") },
    { $inc: { likes: 1 } }
)
```

**Переваги `$inc`:**
- ✅ Атомарна операція
- ✅ Не потребує читання перед записом
- ✅ Уникає race conditions

---

### ✅ Завдання 4: Вибір тільки певних полів

**Функція:** `getArticleTitles()`

**Реалізація:**
```javascript
async function getArticleTitles() {
    return await Article
        .find()
        .select('title likes')  // 👈 Тільки title та likes
        .sort({ likes: -1 });
}
```

**Результат:**
```javascript
[
    { _id: "...", title: "Асинхронне програмування", likes: 25 },
    { _id: "...", title: "REST API Best Practices", likes: 15 },
    { _id: "...", title: "Введення в MongoDB", likes: 3 },
    // body НЕ включений!
]
```

**Альтернативний синтаксис:**
```javascript
// Виключити поле
.select('-body')          // Всі поля крім body

// Включити поля
.select('title likes')    // Тільки title та likes

// Об'єктний синтаксис
.select({ title: 1, likes: 1, _id: 0 })
```

**MongoDB запит:**
```javascript
db.articles.find({}, { title: 1, likes: 1 })
```

---

### ✅ Завдання 5: Find or Create

**Функція:** `findOrCreate(title, body)`

**Реалізація:**
```javascript
async function findOrCreate(title, body) {
    // Спочатку шукаємо
    let article = await Article.findOne({ title });
    
    if (article) {
        return { article, created: false };  // Знайдено
    }
    
    // Якщо не знайдено - створюємо
    article = await Article.create({ title, body });
    return { article, created: true };       // Створено
}
```

**Приклади:**
```javascript
// Перша спроба - створення
const result1 = await findOrCreate(
    'TypeScript Guide',
    'TypeScript додає типізацію до JavaScript...'
);
console.log(result1.created); // true
console.log(result1.article.title); // "TypeScript Guide"

// Друга спроба - пошук існуючої
const result2 = await findOrCreate(
    'TypeScript Guide',
    'Інший текст'
);
console.log(result2.created); // false
console.log(result2.article.title); // "TypeScript Guide"
// body залишився незмінним!
```

**Альтернатива через `findOneAndUpdate`:**
```javascript
const article = await Article.findOneAndUpdate(
    { title },
    { title, body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
);
```

---

### ✅ Завдання 6 (БОНУС): Багатопольове сортування

**Функція:** `getArticlesSorted()`

**Реалізація:**
```javascript
async function getArticlesSorted() {
    return await Article
        .find()
        .sort({ 
            likes: -1,      // 1️⃣ Спочатку за likes (більше → менше)
            createdAt: -1   // 2️⃣ Потім за датою (новіші → старіші)
        });
}
```

**Приклад даних:**
```javascript
// До сортування:
[
    { title: "A", likes: 10, createdAt: "2025-10-16" },
    { title: "B", likes: 10, createdAt: "2025-10-15" },
    { title: "C", likes: 5,  createdAt: "2025-10-17" },
    { title: "D", likes: 20, createdAt: "2025-10-14" }
]

// Після сортування:
[
    { title: "D", likes: 20, createdAt: "2025-10-14" }, // 1. Найбільше лайків
    { title: "A", likes: 10, createdAt: "2025-10-16" }, // 2. 10 лайків, новіша
    { title: "B", likes: 10, createdAt: "2025-10-15" }, // 3. 10 лайків, старіша
    { title: "C", likes: 5,  createdAt: "2025-10-17" }  // 4. Найменше лайків
]
```

**MongoDB запит:**
```javascript
db.articles.find().sort({ likes: -1, createdAt: -1 })
```

**Пояснення:**
- `-1` = від більшого до меншого (DESC)
- `1` = від меншого до більшого (ASC)
- Порядок полів у `.sort()` важливий!

---

## 🎯 Запуск

```bash
# Основний запуск
npm start

# Вивід:
╔═══════════════════════════════════════╗
║   Mongoose Homework - Article CRUD   ║
╚═══════════════════════════════════════╝

✅ Підключено до MongoDB
📦 База даних: homework_db
🗑️  База даних очищена

📝 Завдання 1: Створення статей
=================================
✅ Створено 5 статей
   Введення в MongoDB
      likes: 0 (дефолт: 0)
      createdAt: 2025-10-16T14:30:00.000Z
   ...

📚 Всі статті в базі даних
==========================
1. 📝 Введення в MongoDB | ❤️  0 | 📅 16 жовтня 2025 р., 17:30
2. 📝 Mongoose для початківців | ❤️  0 | 📅 16 жовтня 2025 р., 17:30
3. 📝 Node.js та Express | ❤️  0 | 📅 16 жовтня 2025 р., 17:30
4. 📝 REST API Best Practices | ❤️  15 | 📅 16 жовтня 2025 р., 17:30
5. 📝 Асинхронне програмування | ❤️  25 | 📅 16 жовтня 2025 р., 17:30

🔍 Завдання 2: Пошук по кількох умовах
=====================================
Умови: likes >= 10 AND title contains "Node"

Знайдено: 1 статей
   📝 Node.js та Express | ❤️  0 | 📅 16 жовтня 2025 р., 17:30

❤️  Завдання 3: Лайк статті
===========================
✅ Лайк додано!
   📝 Введення в MongoDB | ❤️  3 | 📅 16 жовтня 2025 р., 17:30

📋 Завдання 4: Тільки назви та лайки
===================================
Знайдено: 6 статей

   Асинхронне програмування — ❤️  25
   REST API Best Practices — ❤️  15
   Введення в MongoDB — ❤️  3
   ...

🔎 Завдання 5: Find or Create
==============================
Пошук: "MongoDB для початківців"
🆕 Створено нову статтю:
   📝 MongoDB для початківців | ❤️  0 | 📅 16 жовтня 2025 р., 17:30

Пошук: "Mongoose для початківців"
✅ Статтю знайдено:
   📝 Mongoose для початківців | ❤️  0 | 📅 16 жовтня 2025 р., 17:30

📊 Завдання 6: Багатопольове сортування
=======================================
Сортування: 1) за likes (↓), 2) за createdAt (↓)

Всього статей: 6

1. 📝 Асинхронне програмування | ❤️  25 | 📅 16 жовтня 2025 р., 17:30
2. 📝 REST API Best Practices | ❤️  15 | 📅 16 жовтня 2025 р., 17:30
3. 📝 Введення в MongoDB | ❤️  3 | 📅 16 жовтня 2025 р., 17:30
...

📈 Статистика
=============
Всього статей: 6
Всього лайків: 43
Середня кількість лайків: 7.2
Найпопулярніша: "Асинхронне програмування" (25 ❤️ )

✨ Всі завдання виконано!
👋 З'єднання з MongoDB закрито
```

---

## 📚 Mongoose методи та оператори

### Основні методи:

| Метод | Опис | Приклад |
|-------|------|---------|
| `create()` | Створення документа | `Article.create({ title: '...' })` |
| `find()` | Пошук документів | `Article.find({ likes: { $gte: 10 } })` |
| `findOne()` | Пошук одного документа | `Article.findOne({ title: '...' })` |
| `findById()` | Пошук по ID | `Article.findById(id)` |
| `findByIdAndUpdate()` | Оновлення по ID | `Article.findByIdAndUpdate(id, data)` |
| `deleteOne()` | Видалення одного | `Article.deleteOne({ _id: id })` |
| `countDocuments()` | Підрахунок | `Article.countDocuments()` |

### Оператори запитів:

| Оператор | Опис | Приклад |
|----------|------|---------|
| `$gte` | Більше або дорівнює | `{ likes: { $gte: 10 } }` |
| `$gt` | Більше | `{ likes: { $gt: 10 } }` |
| `$lte` | Менше або дорівнює | `{ likes: { $lte: 10 } }` |
| `$lt` | Менше | `{ likes: { $lt: 10 } }` |
| `$regex` | Регулярний вираз | `{ title: { $regex: /node/i } }` |
| `$in` | Значення в масиві | `{ status: { $in: ['active', 'pending'] } }` |

### Оператори оновлення:

| Оператор | Опис | Приклад |
|----------|------|---------|
| `$inc` | Інкремент | `{ $inc: { likes: 1 } }` |
| `$set` | Встановити значення | `{ $set: { title: 'New' } }` |
| `$push` | Додати в масив | `{ $push: { tags: 'new' } }` |
| `$pull` | Видалити з масиву | `{ $pull: { tags: 'old' } }` |

### Методи модифікації:

| Метод | Опис | Приклад |
|-------|------|---------|
| `.select()` | Вибір полів | `.select('title likes')` |
| `.sort()` | Сортування | `.sort({ likes: -1 })` |
| `.limit()` | Обмеження кількості | `.limit(10)` |
| `.skip()` | Пропуск записів | `.skip(20)` |
| `.populate()` | Заповнення зв'язків | `.populate('author')` |

---

## 🎓 Що вивчено

### Mongoose концепції:
- ✅ Схеми з дефолтними значеннями
- ✅ Валідація (required, min, trim)
- ✅ Віртуальні поля (virtual)
- ✅ Instance методи (.display())
- ✅ Static методи (.findPopular())

### CRUD операції:
- ✅ Create - створення документів
- ✅ Read - пошук з умовами
- ✅ Update - оновлення з $inc
- ✅ Delete - видалення (не використано в ДЗ)

### Запити:
- ✅ Комбіновані умови ({ $gte, $regex })
- ✅ Вибір полів (.select())
- ✅ Сортування за кількома полями
- ✅ Агрегація (aggregate, $sum)

### Patterns:
- ✅ Find-or-Create патерн
- ✅ Atomic operations ($inc)
- ✅ Default values
- ✅ Data validation

### Best Practices:
- ✅ Async/await для асинхронних операцій
- ✅ Try/catch для обробки помилок
- ✅ Connection pooling
- ✅ Graceful shutdown

---

## 🛠 Корисні команди MongoDB

```bash
# Підключення до MongoDB
mongosh

# Показати бази даних
show dbs

# Використовувати базу
use homework_db

# Показати колекції
show collections

# Показати всі документи
db.articles.find()

# Показати з форматуванням
db.articles.find().pretty()

# Підрахунок документів
db.articles.countDocuments()

# Очистити колекцію
db.articles.deleteMany({})

# Видалити базу даних
db.dropDatabase()
```

---

## 📊 Результати виконання

| Завдання | Статус | Ключові концепції |
|----------|--------|-------------------|
| 1. Дефолтні значення | ✅ | Schema, default values |
| 2. Пошук по умовах | ✅ | $gte, $regex, find() |
| 3. Інкремент | ✅ | $inc, findByIdAndUpdate() |
| 4. Вибір полів | ✅ | .select() |
| 5. Find or Create | ✅ | findOne() + create() |
| 6. Багатопольове сортування | ✅ | .sort({ field1: -1, field2: -1 }) |

---

## 🔗 Додаткові ресурси

- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [MongoDB Query Operators](https://www.mongodb.com/docs/manual/reference/operator/query/)
- [Mongoose Validation](https://mongoosejs.com/docs/validation.html)
- [Mongoose Middleware](https://mongoosejs.com/docs/middleware.html)

---

**Всі завдання виконано! ✨**
