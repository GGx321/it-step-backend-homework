const mongoose = require('mongoose');

// Завдання 1: Схема з дефолтними значеннями
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Назва статті обов\'язкова'],
        trim: true
    },
    body: {
        type: String,
        trim: true
    },
    likes: {
        type: Number,
        default: 0,
        min: [0, 'Кількість лайків не може бути від\'ємною']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Віртуальне поле для форматованої дати
articleSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Метод для відображення статті
articleSchema.methods.display = function() {
    return `📝 ${this.title} | ❤️  ${this.likes} | 📅 ${this.formattedDate}`;
};

// Статичний метод для пошуку популярних статей
articleSchema.statics.findPopular = function(minLikes) {
    return this.find({ likes: { $gte: minLikes } }).sort({ likes: -1 });
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
