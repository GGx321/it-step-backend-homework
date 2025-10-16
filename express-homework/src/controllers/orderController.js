let orders = [
    { id: 1, product: "Ноутбук", quantity: 2, date: new Date().toISOString() },
    { id: 2, product: "Мишка", quantity: 5, date: new Date().toISOString() }
];

let nextId = 3;

const getOrders = (req, res) => {
    res.render("orders-list", { orders });
};

const getOrderById = (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
        return res.render("order-detail", { 
            order: null, 
            message: "Замовлення не знайдено" 
        });
    }
    
    res.render("order-detail", { order, message: null });
};

const createOrder = (req, res) => {
    const { product, quantity } = req.body;
    
    if (!product || !quantity) {
        return res.status(400).send("Товар та кількість обов'язкові");
    }
    
    const newOrder = {
        id: nextId++,
        product,
        quantity: parseInt(quantity),
        date: new Date().toISOString()
    };
    
    orders.push(newOrder);
    res.redirect("/api/orders");
};

const deleteOrder = (req, res) => {
    const id = parseInt(req.params.id);
    orders = orders.filter(o => o.id !== id);
    res.redirect("/api/orders");
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    deleteOrder
};
