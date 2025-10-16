const { connectDB, disconnectDB, clearDB } = require('./db');
const Article = require('./models/Article');

// =====================================================
// Завдання 1: Створення статей з дефолтними значеннями
// =====================================================

async function createArticles() {
    console.log('\n📝 Завдання 1: Створення статей');
    console.log('=================================');
    
    try {
        // Створюємо статті БЕЗ вказання likes та createdAt
        const articles = await Article.insertMany([
            {
                title: 'Введення в MongoDB',
                body: 'MongoDB - це документо-орієнтована NoSQL база даних...'
            },
            {
                title: 'Mongoose для початківців',
                body: 'Mongoose надає просту схему для моделювання даних...'
            },
            {
                title: 'Node.js та Express',
                body: 'Express - це мінімалістичний веб-фреймворк для Node.js...'
                // likes та createdAt будуть встановлені автоматично
            },
            {
                title: 'REST API Best Practices',
                body: 'Створення якісного REST API вимагає дотримання стандартів...',
                likes: 15 // Вказуємо likes вручну
            },
            {
                title: 'Асинхронне програмування',
                body: 'Async/await робить асинхронний код більш читабельним...',
                likes: 25
            }
        ]);
        
        console.log(`✅ Створено ${articles.length} статей`);
        
        // Перевірка дефолтних значень
        articles.forEach(article => {
            console.log(`   ${article.title}`);
            console.log(`      likes: ${article.likes} (дефолт: 0)`);
            console.log(`      createdAt: ${article.createdAt.toISOString()}`);
        });
        
        return articles;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 2: Пошук по кількох умовах
// =====================================================

async function findPopularArticles(minLikes, keyword) {
    console.log('\n🔍 Завдання 2: Пошук по кількох умовах');
    console.log('=====================================');
    console.log(`Умови: likes >= ${minLikes} AND title contains "${keyword}"`);
    
    try {
        const articles = await Article.find({
            likes: { $gte: minLikes },
            title: { $regex: keyword, $options: 'i' } // case-insensitive пошук
        });
        
        console.log(`\nЗнайдено: ${articles.length} статей`);
        
        articles.forEach(article => {
            console.log(`   ${article.display()}`);
        });
        
        return articles;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 3: Оновлення з інкрементом
// =====================================================

async function likeArticle(id) {
    console.log('\n❤️  Завдання 3: Лайк статті');
    console.log('===========================');
    
    try {
        const article = await Article.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } }, // Збільшуємо likes на 1
            { new: true } // Повертаємо оновлений документ
        );
        
        if (!article) {
            console.log(`❌ Статтю з ID ${id} не знайдено`);
            return null;
        }
        
        console.log(`✅ Лайк додано!`);
        console.log(`   ${article.display()}`);
        
        return article;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 4: Вибір тільки певних полів
// =====================================================

async function getArticleTitles() {
    console.log('\n📋 Завдання 4: Тільки назви та лайки');
    console.log('===================================');
    
    try {
        const articles = await Article
            .find()
            .select('title likes') // Вибираємо тільки ці поля
            .sort({ likes: -1 }); // Бонус: сортування за лайками
        
        console.log(`Знайдено: ${articles.length} статей\n`);
        
        articles.forEach(article => {
            console.log(`   ${article.title} — ❤️  ${article.likes}`);
        });
        
        return articles;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 5: Пошук або створення
// =====================================================

async function findOrCreate(title, body) {
    console.log('\n🔎 Завдання 5: Find or Create');
    console.log('==============================');
    console.log(`Пошук: "${title}"`);
    
    try {
        // Шукаємо статтю
        let article = await Article.findOne({ title });
        
        if (article) {
            console.log('✅ Статтю знайдено:');
            console.log(`   ${article.display()}`);
            return { article, created: false };
        }
        
        // Якщо не знайдено - створюємо
        article = await Article.create({ title, body });
        console.log('🆕 Створено нову статтю:');
        console.log(`   ${article.display()}`);
        
        return { article, created: true };
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 6 (БОНУС): Сортування за кількома полями
// =====================================================

async function getArticlesSorted() {
    console.log('\n📊 Завдання 6: Багатопольове сортування');
    console.log('=======================================');
    console.log('Сортування: 1) за likes (↓), 2) за createdAt (↓)');
    
    try {
        const articles = await Article
            .find()
            .sort({ 
                likes: -1,      // Спочатку за кількістю лайків (більше → менше)
                createdAt: -1   // Потім за датою (новіші → старіші)
            });
        
        console.log(`\nВсього статей: ${articles.length}\n`);
        
        articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.display()}`);
        });
        
        return articles;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Додаткові корисні функції
// =====================================================

async function showAllArticles() {
    console.log('\n📚 Всі статті в базі даних');
    console.log('==========================');
    
    try {
        const articles = await Article.find().sort({ createdAt: 1 });
        
        if (articles.length === 0) {
            console.log('База даних порожня');
            return [];
        }
        
        articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.display()}`);
            console.log(`   ID: ${article._id}`);
            if (article.body) {
                console.log(`   Текст: ${article.body.substring(0, 50)}...`);
            }
        });
        
        return articles;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

async function getArticleStats() {
    console.log('\n📈 Статистика');
    console.log('=============');
    
    try {
        const totalArticles = await Article.countDocuments();
        const totalLikes = await Article.aggregate([
            { $group: { _id: null, total: { $sum: '$likes' } } }
        ]);
        
        const avgLikes = totalLikes[0]?.total / totalArticles || 0;
        const mostLiked = await Article.findOne().sort({ likes: -1 });
        
        console.log(`Всього статей: ${totalArticles}`);
        console.log(`Всього лайків: ${totalLikes[0]?.total || 0}`);
        console.log(`Середня кількість лайків: ${avgLikes.toFixed(1)}`);
        if (mostLiked) {
            console.log(`Найпопулярніша: "${mostLiked.title}" (${mostLiked.likes} ❤️ )`);
        }
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Головна функція
// =====================================================

async function main() {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║   Mongoose Homework - Article CRUD   ║');
    console.log('╚═══════════════════════════════════════╝');
    
    try {
        // Підключення до MongoDB
        await connectDB();
        
        // Очищення БД для чистого тесту
        await clearDB();
        
        // Завдання 1: Створення статей
        await createArticles();
        
        // Показати всі статті
        const allArticles = await showAllArticles();
        
        // Завдання 2: Пошук популярних статей з ключовим словом
        await findPopularArticles(10, 'Node');
        await findPopularArticles(0, 'MongoDB');
        
        // Завдання 3: Додати лайк першій статті
        if (allArticles.length > 0) {
            await likeArticle(allArticles[0]._id);
            // Додамо ще кілька лайків
            await likeArticle(allArticles[0]._id);
            await likeArticle(allArticles[0]._id);
        }
        
        // Завдання 4: Отримати тільки назви та лайки
        await getArticleTitles();
        
        // Завдання 5: Find or Create
        await findOrCreate('MongoDB для початківців', 'Новий контент про MongoDB');
        await findOrCreate('Mongoose для початківців', 'Цей заголовок вже існує');
        
        // Завдання 6: Сортування
        await getArticlesSorted();
        
        // Статистика
        await getArticleStats();
        
        console.log('\n✨ Всі завдання виконано!');
        
    } catch (error) {
        console.error('\n❌ Критична помилка:', error);
    } finally {
        // Закриття з'єднання
        await disconnectDB();
    }
}

// Запуск програми
if (require.main === module) {
    main();
}

// Експорт функцій
module.exports = {
    createArticles,
    findPopularArticles,
    likeArticle,
    getArticleTitles,
    findOrCreate,
    getArticlesSorted,
    showAllArticles,
    getArticleStats
};
