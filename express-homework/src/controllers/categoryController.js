let categories = [
    { id: 1, name: "Електроніка", createdAt: new Date().toISOString() },
    { id: 2, name: "Книги", createdAt: new Date().toISOString() },
    { id: 3, name: "Одяг", createdAt: new Date().toISOString() }
];

let nextId = 4;

const MAX_NAME_LENGTH = 30;

const getAllCategories = (req, res) => {
    res.render('categories-list', { 
        categories,
        count: categories.length
    });
};

const getCategoryById = (req, res) => {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    
    if (!category) {
        return res.render('category-detail', {
            category: null,
            message: "Категорію не знайдено"
        });
    }
    
    res.render('category-detail', { category, message: null });
};

const showCreateForm = (req, res) => {
    res.render('category-form', {
        category: null,
        action: 'create',
        error: null
    });
};

const createCategory = (req, res) => {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
        return res.render('category-form', {
            category: null,
            action: 'create',
            error: "Назва категорії обов'язкова"
        });
    }
    
    if (name.length > MAX_NAME_LENGTH) {
        return res.render('category-form', {
            category: null,
            action: 'create',
            error: `Назва не повинна перевищувати ${MAX_NAME_LENGTH} символів`
        });
    }
    
    const newCategory = {
        id: nextId++,
        name: name.trim(),
        createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    res.redirect('/api/categories');
};

const showEditForm = (req, res) => {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    
    if (!category) {
        return res.redirect('/api/categories');
    }
    
    res.render('category-form', {
        category,
        action: 'edit',
        error: null
    });
};

const updateCategory = (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const category = categories.find(c => c.id === id);
    
    if (!category) {
        return res.redirect('/api/categories');
    }
    
    if (!name || name.trim().length === 0) {
        return res.render('category-form', {
            category,
            action: 'edit',
            error: "Назва категорії обов'язкова"
        });
    }
    
    if (name.length > MAX_NAME_LENGTH) {
        return res.render('category-form', {
            category,
            action: 'edit',
            error: `Назва не повинна перевищувати ${MAX_NAME_LENGTH} символів`
        });
    }
    
    category.name = name.trim();
    res.redirect('/api/categories');
};

const deleteCategory = (req, res) => {
    const id = parseInt(req.params.id);
    categories = categories.filter(c => c.id !== id);
    res.redirect('/api/categories');
};

module.exports = {
    getAllCategories,
    getCategoryById,
    showCreateForm,
    createCategory,
    showEditForm,
    updateCategory,
    deleteCategory
};
