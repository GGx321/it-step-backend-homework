// Middleware для обробки помилок
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Помилка валідації Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ 
            error: 'Помилка валідації', 
            details: errors 
        });
    }
    
    // Помилка CastError (невірний ID)
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            error: 'Невірний формат ID' 
        });
    }
    
    // Помилка унікальності (duplicate key)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({ 
            error: `Поле "${field}" вже використовується` 
        });
    }
    
    // Загальна помилка сервера
    res.status(500).json({ 
        error: 'Внутрішня помилка сервера',
        message: err.message 
    });
};

// Middleware для неіснуючих маршрутів
export const notFound = (req, res) => {
    res.status(404).json({ 
        error: 'Маршрут не знайдено',
        path: req.originalUrl
    });
};
