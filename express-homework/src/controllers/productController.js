let products = [
    { id: 1, name: "Ноутбук", price: 25000, category: "Електроніка" },
    { id: 2, name: "Мишка", price: 500, category: "Аксесуари" },
    { id: 3, name: "Клавіатура", price: 1200, category: "Аксесуари" },
    { id: 4, name: "Монітор", price: 15000, category: "Електроніка" },
    { id: 5, name: "Навушники", price: 800, category: "Аксесуари" }
];

const getAllProducts = (req, res) => {
    if (products.length === 0) {
        return res.render('products-list', { 
            products, 
            message: "Немає товарів для відображення" 
        });
    }
    res.render('products-list', { products, message: null });
};

const getProductById = (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.render('product-detail', { 
            product: null, 
            message: "Товар не знайдено" 
        });
    }
    
    res.render('product-detail', { product, message: null });
};

const searchProducts = (req, res) => {
    const { name } = req.query;
    
    if (!name) {
        return res.render('search-products', { 
            products: [], 
            query: '', 
            message: "Введіть назву товару для пошуку" 
        });
    }
    
    const foundProducts = products.filter(p => 
        p.name.toLowerCase().includes(name.toLowerCase())
    );
    
    const message = foundProducts.length === 0 
        ? `Товарів з назвою "${name}" не знайдено` 
        : null;
    
    res.render('search-products', { 
        products: foundProducts, 
        query: name, 
        message 
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    searchProducts
};
