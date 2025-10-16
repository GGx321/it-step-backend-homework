const validateBookBody = (req, res, next) => {
    const { title, author, price } = req.body;
    const errors = [];
    
    if (title !== undefined) {
        if (typeof title !== 'string' || title.length < 2) {
            errors.push('Title must be a string with at least 2 characters');
        }
    }
    
    if (author !== undefined) {
        if (typeof author !== 'string' || author.trim().length === 0) {
            errors.push('Author must be a non-empty string');
        }
    }
    
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            errors.push('Price must be a positive number');
        }
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            error: 'ValidationError',
            details: errors
        });
    }
    
    next();
};

const validateUserBody = (req, res, next) => {
    const { name, email } = req.body;
    const errors = [];
    
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            errors.push('Name is required and must be a non-empty string');
        }
    }
    
    if (email !== undefined) {
        if (typeof email !== 'string' || !email.includes('@')) {
            errors.push('Email must be a valid email address');
        }
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            error: 'ValidationError',
            details: errors
        });
    }
    
    next();
};

module.exports = {
    validateBookBody,
    validateUserBody
};
