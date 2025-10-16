const express = require('express');
const router = express.Router();

const comments = [
    { 
        author: "Анна", 
        text: "Гарна стаття!", 
        date: "2025-09-11T11:30:00" 
    },
    { 
        author: "Іван", 
        text: "Дуже інформативно", 
        date: "2025-09-12T14:45:00" 
    },
    { 
        author: "Марія", 
        text: "Дякую за корисну інформацію! Чекаю на продовження.", 
        date: "2025-09-15T09:20:00" 
    },
    { 
        author: "Олександр", 
        text: "Все зрозуміло пояснено, рекомендую!", 
        date: "2025-10-01T16:10:00" 
    }
];

router.get('/', (req, res) => {
    res.render('comments', { comments });
});

module.exports = router;