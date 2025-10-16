import express from "express";
import {
    createComment,
    getAllComments,
    getCommentsByUser,
    updateComment,
    deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

// POST /comments - створити коментар
router.post('/', createComment);

// GET /comments - отримати всі коментарі (з пошуком та пагінацією)
router.get('/', getAllComments);

// GET /comments/user/:id - отримати коментарі конкретного користувача
router.get('/user/:id', getCommentsByUser);

// PUT /comments/:id - оновити коментар (бонус)
router.put('/:id', updateComment);

// DELETE /comments/:id - видалити коментар (бонус)
router.delete('/:id', deleteComment);

export default router;
