-- =====================================================
-- Домашнє завдання 1: Робота з таблицею courses
-- =====================================================

-- Завдання 1. Створення таблиці courses
-- =====================================================

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    duration INT NOT NULL,  -- тривалість у годинах
    price DECIMAL(10, 2) NOT NULL
);

-- Завдання 2. Додавання даних
-- =====================================================

INSERT INTO courses (title, duration, price) VALUES
    ('Безкоштовний курс HTML/CSS', 20, 0),                    -- безкоштовний
    ('JavaScript для початківців', 40, 1500),                 -- звичайна ціна
    ('React Professional', 60, 3500),                         -- звичайна ціна
    ('Full Stack Developer Bootcamp', 120, 8500);             -- дорожчий за 5000

-- Перевірка додавання
SELECT * FROM courses;

-- Завдання 3. Вибірка з умовами
-- =====================================================

-- 3.1. Усі безкоштовні курси
SELECT * FROM courses 
WHERE price = 0;

-- 3.2. Курси дорожчі за 2000 грн
SELECT * FROM courses 
WHERE price > 2000;

-- 3.3. Назва курсу та знижка 20% (нова ціна)
SELECT 
    title AS "Назва курсу",
    price AS "Стара ціна",
    ROUND(price * 0.8, 2) AS "Ціна зі знижкою 20%",
    ROUND(price * 0.2, 2) AS "Сума знижки"
FROM courses;

-- Завдання 4. Оновлення даних
-- =====================================================

-- Збільшуємо тривалість курсу "JavaScript для початківців" на 10 годин
UPDATE courses 
SET duration = duration + 10 
WHERE title = 'JavaScript для початківців';

-- Перевірка оновлення
SELECT title, duration FROM courses 
WHERE title = 'JavaScript для початківців';

-- Завдання 5. Видалення даних
-- =====================================================

-- Видаляємо всі курси дешевші за 500 грн
DELETE FROM courses 
WHERE price < 500;

-- Перевірка (безкоштовний курс має бути видалений)
SELECT * FROM courses;

-- Завдання 6. Аналітичне завдання
-- =====================================================

/*
ВІДПОВІДЬ:

Додаткові поля для навчальної платформи:

1. instructor_name VARCHAR(100)
   - Ім'я викладача курсу
   - Потрібно для відображення інформації про викладача
   - Допомагає студентам обрати курс на основі експертизи викладача

2. students_count INT DEFAULT 0
   - Кількість студентів, що записалися на курс
   - Показує популярність курсу
   - Може використовуватися для аналітики та маркетингу

3. rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5)
   - Рейтинг курсу від 0 до 5
   - Відгуки студентів про якість курсу
   - Допомагає новим студентам обрати якісний курс

4. category VARCHAR(50)
   - Категорія курсу (Frontend, Backend, Design, тощо)
   - Для фільтрації та пошуку курсів
   - Організація курсів по напрямках

5. start_date DATE
   - Дата початку курсу
   - Для планування навчання
   - Показує актуальність курсу

6. is_active BOOLEAN DEFAULT true
   - Чи активний курс зараз
   - Для приховування застарілих курсів
   - Управління доступністю курсу

Приклад розширеної таблиці:
*/

CREATE TABLE courses_extended (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    duration INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    instructor_name VARCHAR(100),
    students_count INT DEFAULT 0,
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    category VARCHAR(50),
    start_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Приклад даних з розширеними полями
INSERT INTO courses_extended (title, duration, price, instructor_name, students_count, rating, category, start_date) VALUES
    ('JavaScript для початківців', 40, 1500, 'Іван Петренко', 150, 4.5, 'Frontend', '2025-11-01'),
    ('React Professional', 60, 3500, 'Марія Коваленко', 85, 4.8, 'Frontend', '2025-11-15'),
    ('Full Stack Developer', 120, 8500, 'Олександр Шевченко', 45, 4.9, 'Full Stack', '2025-12-01');

-- Корисні запити з новими полями:

-- Топ курсів за рейтингом
SELECT title, instructor_name, rating, students_count 
FROM courses_extended 
WHERE is_active = true 
ORDER BY rating DESC;

-- Курси по категоріях
SELECT category, COUNT(*) as courses_count, AVG(rating) as avg_rating
FROM courses_extended 
GROUP BY category;

-- Найпопулярніші курси
SELECT title, students_count, rating
FROM courses_extended 
WHERE is_active = true
ORDER BY students_count DESC
LIMIT 5;
