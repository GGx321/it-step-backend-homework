const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, searchProducts } = require('../../controllers/productController');
const authMiddleware = require('../../middleware/authMiddleware');

// Применяем auth middleware ко всем маршрутам products
router.use(authMiddleware);

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

module.exports = router;
