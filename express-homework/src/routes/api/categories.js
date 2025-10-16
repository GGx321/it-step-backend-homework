const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    showCreateForm,
    createCategory,
    showEditForm,
    updateCategory,
    deleteCategory
} = require('../../controllers/categoryController');

router.get('/', getAllCategories);
router.get('/new', showCreateForm);
router.post('/new', createCategory);
router.get('/edit/:id', showEditForm);
router.post('/edit/:id', updateCategory);
router.get('/delete/:id', deleteCategory);
router.get('/:id', getCategoryById);

module.exports = router;
