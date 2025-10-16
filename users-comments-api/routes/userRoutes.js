import express from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// POST /users - створити користувача
router.post('/', createUser);

// GET /users - отримати всіх користувачів (з пагінацією)
router.get('/', getAllUsers);

// GET /users/:id - отримати одного користувача з коментарями
router.get('/:id', getUserById);

// PUT /users/:id - оновити дані користувача
router.put('/:id', updateUser);

// DELETE /users/:id - видалити користувача
router.delete('/:id', deleteUser);

export default router;
