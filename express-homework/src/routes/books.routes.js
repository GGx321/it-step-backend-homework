const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBooksPaginated
} = require('../data/books');
const { validateBookBody } = require('../middleware/validation');

// GET /api/books - Get all books with filtering and pagination
router.get('/', (req, res, next) => {
    try {
        const { q, page = 1, limit = 5 } = req.query;
        
        let filteredBooks = getBooks();
        
        if (q) {
            filteredBooks = searchBooks(q);
        }
        
        const result = getBooksPaginated(filteredBooks, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// GET /api/books/:id - Get book by ID
router.get('/:id', (req, res, next) => {
    try {
        const book = getBookById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Book not found'
            });
        }
        
        res.json(book);
    } catch (error) {
        next(error);
    }
});

// POST /api/books - Create new book
router.post('/', validateBookBody, (req, res, next) => {
    try {
        const { title, author, price } = req.body;
        
        if (!title || !author || price === undefined) {
            return res.status(400).json({
                error: 'ValidationError',
                details: 'Title, author, and price are required'
            });
        }
        
        const newBook = addBook({ title, author, price });
        res.status(201).json(newBook);
    } catch (error) {
        next(error);
    }
});

// PUT /api/books/:id - Update book
router.put('/:id', validateBookBody, (req, res, next) => {
    try {
        const book = getBookById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Book not found'
            });
        }
        
        const updatedBook = updateBook(req.params.id, req.body);
        res.json(updatedBook);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/books/:id - Delete book
router.delete('/:id', (req, res, next) => {
    try {
        const book = getBookById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Book not found'
            });
        }
        
        deleteBook(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// BONUS: GET /api/books/:id/recommendations - Get book recommendations
router.get('/:id/recommendations', (req, res, next) => {
    try {
        const book = getBookById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Book not found'
            });
        }
        
        const allBooks = getBooks();
        const recommendations = allBooks
            .filter(b => b.id !== book.id)
            .filter(b => 
                b.title.toLowerCase().includes(book.title.toLowerCase().split(' ')[0]) ||
                b.author.toLowerCase().includes(book.author.toLowerCase().split(' ')[0])
            )
            .slice(0, 3);
        
        res.json({
            book: book.title,
            recommendations
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
