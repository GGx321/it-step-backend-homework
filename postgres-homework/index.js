const pool = require('./db');

// =====================================================
// Завдання 1: Вивести список імен у верхньому регістрі
// =====================================================

async function getUserNamesUpper() {
    try {
        const query = 'SELECT UPPER(name) AS username FROM users';
        const result = await pool.query(query);
        
        const usernames = result.rows.map(row => row.username);
        
        console.log('\n📝 Завдання 1: Імена у верхньому регістрі');
        console.log('=====================================');
        console.log(usernames);
        
        return usernames;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 2: Користувачі з літерою "a" в email
// =====================================================

async function findUsersWithA() {
    try {
        const query = `
            SELECT name, email 
            FROM users 
            WHERE email LIKE '%a%'
            ORDER BY name
        `;
        const result = await pool.query(query);
        
        console.log('\n📧 Завдання 2: Email містить літеру "a"');
        console.log('=====================================');
        
        result.rows.forEach(user => {
            console.log(`${user.name} — ${user.email}`);
        });
        
        return result.rows;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 3: Кількість користувачів по доменах
// =====================================================

async function countByDomain() {
    try {
        const query = `
            SELECT 
                SPLIT_PART(email, '@', 2) AS domain, 
                COUNT(*) AS count
            FROM users 
            GROUP BY domain
            ORDER BY count DESC, domain
        `;
        const result = await pool.query(query);
        
        console.log('\n🌐 Завдання 3: Кількість по доменах');
        console.log('=====================================');
        
        result.rows.forEach(row => {
            console.log(`${row.domain} — ${row.count}`);
        });
        
        return result.rows;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 4: Користувачі за порядком створення
// =====================================================

async function getUsersOrdered() {
    try {
        const query = `
            SELECT 
                name, 
                email, 
                TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at
            FROM users 
            ORDER BY created_at ASC
        `;
        const result = await pool.query(query);
        
        console.log('\n📅 Завдання 4: Користувачі за порядком створення');
        console.log('================================================');
        
        result.rows.forEach(user => {
            console.log({
                name: user.name,
                email: user.email,
                created_at: user.created_at
            });
        });
        
        return result.rows;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Завдання 5: Оновлення імені за email
// =====================================================

async function renameUserByEmail(email, newName) {
    try {
        // Спочатку перевіряємо чи існує користувач
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await pool.query(checkQuery, [email]);
        
        if (checkResult.rows.length === 0) {
            console.log(`\n❌ Користувача з email "${email}" не знайдено`);
            return null;
        }
        
        // Оновлюємо ім'я
        const updateQuery = `
            UPDATE users 
            SET name = $1 
            WHERE email = $2 
            RETURNING *
        `;
        const updateResult = await pool.query(updateQuery, [newName, email]);
        
        console.log(`\n✅ Ім'я користувача оновлено:`);
        console.log(`   Email: ${email}`);
        console.log(`   Нове ім'я: ${newName}`);
        
        return updateResult.rows[0];
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Додаткові корисні функції
// =====================================================

async function showAllUsers() {
    try {
        const query = 'SELECT * FROM users ORDER BY id';
        const result = await pool.query(query);
        
        console.log('\n👥 Всі користувачі в базі даних');
        console.log('================================');
        console.table(result.rows);
        
        return result.rows;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

async function resetDatabase() {
    try {
        // Видаляємо всі дані
        await pool.query('DELETE FROM users');
        
        // Додаємо тестові дані
        const insertQuery = `
            INSERT INTO users (name, email) VALUES
                ('Alice', 'alice@example.com'),
                ('Bob', 'bob@gmail.com'),
                ('Charlie', 'charlie@example.com'),
                ('David', 'david@yahoo.com'),
                ('Anna', 'anna@example.com')
            RETURNING *
        `;
        const result = await pool.query(insertQuery);
        
        console.log('\n🔄 База даних скинута до початкового стану');
        console.log(`   Додано ${result.rows.length} користувачів`);
        
        return result.rows;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// =====================================================
// Головна функція для запуску всіх завдань
// =====================================================

async function main() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   PostgreSQL Homework - Node.js App   ║');
    console.log('╚════════════════════════════════════════╝');
    
    try {
        // Показуємо всіх користувачів на початку
        await showAllUsers();
        
        // Виконуємо всі завдання
        await getUserNamesUpper();
        await findUsersWithA();
        await countByDomain();
        await getUsersOrdered();
        
        // Тестуємо оновлення
        await renameUserByEmail('bob@gmail.com', 'Robert');
        
        // Тестуємо помилку
        await renameUserByEmail('nonexistent@email.com', 'Test');
        
        // Показуємо результат після змін
        await showAllUsers();
        
        console.log('\n✨ Всі завдання виконано!');
        
    } catch (error) {
        console.error('\n❌ Критична помилка:', error);
    } finally {
        // Закриваємо з'єднання з БД
        await pool.end();
        console.log('\n👋 З'єднання з базою даних закрито');
    }
}

// Запуск програми
if (require.main === module) {
    main();
}

// Експорт функцій для використання в інших модулях
module.exports = {
    getUserNamesUpper,
    findUsersWithA,
    countByDomain,
    getUsersOrdered,
    renameUserByEmail,
    showAllUsers,
    resetDatabase
};
