import { User } from "../models/User.js";
import { Comment } from "../models/Comment.js";

// CREATE user
export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Перевірка обов'язкових полів
        if (!name || !email) {
            return res.status(400).json({ 
                error: 'Ім\'я та email обов\'язкові' 
            });
        }
        
        const user = await User.create({ name, email });
        res.status(201).json({
            message: 'Користувача створено',
            user
        });
    } catch (err) {
        // Помилка унікальності email
        if (err.code === 11000) {
            return res.status(400).json({ 
                error: 'Email вже використовується' 
            });
        }
        res.status(400).json({ error: err.message });
    }
};

// READ all users (з пагінацією)
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        // Пагінація
        const skip = (pageNum - 1) * limitNum;
        
        const users = await User.find()
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });
        
        const total = await User.countDocuments();
        
        res.json({
            users,
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

// READ one user with comments
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }
        
        // Отримуємо коментарі користувача
        const comments = await Comment.find({ userId: user._id })
            .sort({ createdAt: -1 });
        
        res.json({ 
            ...user.toObject(), 
            comments 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE user
export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        const updated = await User.findByIdAndUpdate(
            req.params.id, 
            { name, email },
            { 
                new: true,           // Повернути оновлений документ
                runValidators: true  // Запустити валідацію
            }
        );
        
        if (!updated) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }
        
        res.json({
            message: 'Користувача оновлено',
            user: updated
        });
    } catch (err) {
        // Помилка унікальності email
        if (err.code === 11000) {
            return res.status(400).json({ 
                error: 'Email вже використовується' 
            });
        }
        res.status(400).json({ error: err.message });
    }
};

// DELETE user (cascade delete comments)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }
        
        // Видаляємо всі коментарі користувача
        const deletedComments = await Comment.deleteMany({ userId: req.params.id });
        
        // Видаляємо користувача
        await User.findByIdAndDelete(req.params.id);
        
        res.json({ 
            message: "Користувача та його коментарі видалено",
            deletedCommentsCount: deletedComments.deletedCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
