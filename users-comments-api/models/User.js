import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Ім\'я користувача обов\'язкове'],
        trim: true
    },
    email: { 
        type: String, 
        unique: true, 
        required: [true, 'Email обов\'язковий'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Невірний формат email']
    }
}, {
    timestamps: true // Додає createdAt та updatedAt
});

// Віртуальне поле для коментарів (не зберігається в БД)
userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'userId'
});

// Налаштування для JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Middleware перед видаленням користувача
userSchema.pre('deleteOne', { document: true, query: false }, async function() {
    // Видалити всі коментарі користувача
    await mongoose.model('Comment').deleteMany({ userId: this._id });
});

export const User = mongoose.model("User", userSchema);
