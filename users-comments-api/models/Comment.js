import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: [true, 'Текст коментаря обов\'язковий'],
        trim: true,
        minlength: [1, 'Коментар не може бути порожнім']
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, 'ID користувача обов\'язковий']
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Індекс для швидкого пошуку коментарів користувача
commentSchema.index({ userId: 1 });

// Індекс для текстового пошуку
commentSchema.index({ text: 'text' });

export const Comment = mongoose.model("Comment", commentSchema);
