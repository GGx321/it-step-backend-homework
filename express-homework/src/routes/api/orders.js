const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, createOrder, deleteOrder } = require('../../controllers/orderController');

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.get('/delete/:id', deleteOrder);

module.exports = router;
