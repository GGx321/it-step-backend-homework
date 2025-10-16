const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    getUsersByRole
} = require('../data/users');
const { validateUserBody } = require('../middleware/validation');

// GET /api/users - Get all users with optional role filter
router.get('/', (req, res, next) => {
    try {
        const { role } = req.query;
        let users = getUsers();
        
        if (role) {
            users = getUsersByRole(role);
        }
        
        res.json(users);
    } catch (error) {
        next(error);
    }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res, next) => {
    try {
        const user = getUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found'
            });
        }
        
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// POST /api/users - Create new user
router.post('/', validateUserBody, (req, res, next) => {
    try {
        const { name, email, role = 'user' } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({
                error: 'ValidationError',
                details: 'Name and email are required'
            });
        }
        
        const newUser = addUser({ name, email, role });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

// PUT /api/users/:id - Update user
router.put('/:id', validateUserBody, (req, res, next) => {
    try {
        const user = getUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found'
            });
        }
        
        const updatedUser = updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res, next) => {
    try {
        const user = getUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found'
            });
        }
        
        deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
