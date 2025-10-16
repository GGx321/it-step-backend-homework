import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";

// CREATE comment
export const createComment = async (req, res) => {
    try {
        const { text, userId } = req.body;
        
        // Перевірка обов'язкових полів
        if (!text || !userId) {
            return res.status(400).json({ 
                error: 'Текст та userId обов\'язкові' 
            });
        }
        
        // Перевірка існування користувача
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ 
                error: 'Користувача не знайдено' 
            });
        }
        
        const comment = await Comment.create({ text, userId });
        
        // Повертаємо коментар з інформацією про користувача
        const populatedComment = await Comment.findById(comment._id)
            .populate('userId', 'name email');
        
        res.status(201).json({
            message: 'Коментар створено',
            comment: populatedComment
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ all comments (з пошуком та пагінацією)
export const getAllComments = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        
        // Фільтр для пошуку
        const filter = search 
            ? { text: { $regex: search, $options: "i" } } 
            : {};
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        
        // Отримуємо коментарі з populate userId
        const comments = await Comment.find(filter)
            .populate("userId", "name email")
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });
        
        const total = await Comment.countDocuments(filter);
        
        res.json({
            comments,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ comments by specific user
export const getCommentsByUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Перевірка існування користувача
        const userExists = await User.findById(id);
        if (!userExists) {
            return res.status(404).json({ 
                error: 'Користувача не знайдено' 
            });
        }
        
        const comments = await Comment.find({ userId: id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        
        res.json({
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email
            },
            comments,
            count: comments.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE comment (бонус)
export const updateComment = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ 
                error: 'Текст обов\'язковий' 
            });
        }
        
        const updated = await Comment.findByIdAndUpdate(
            req.params.id,
            { text },
            { new: true, runValidators: true }
        ).populate('userId', 'name email');
        
        if (!updated) {
            return res.status(404).json({ error: "Коментар не знайдено" });
        }
        
        res.json({
            message: 'Коментар оновлено',
            comment: updated
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE comment (бонус)
export const deleteComment = async (req, res) => {
    try {
        const deleted = await Comment.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ error: "Коментар не знайдено" });
        }
        
        res.json({ 
            message: "Коментар видалено",
            comment: deleted
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
