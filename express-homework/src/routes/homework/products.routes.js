const express = require('express');
const router = express.Router();

const products = [
    { name: "Ноутбук", price: 25000 },
    { name: "Мишка", price: 500 },
    { name: "Клавіатура", price: 1200 },
    { name: "Монітор", price: 15000 },
    { name: "Навушники", price: 800 },
    { name: "Веб-камера", price: 2500 }
];

router.get('/', (req, res) => {
    res.render('products', { products });
});

module.exports = router;
