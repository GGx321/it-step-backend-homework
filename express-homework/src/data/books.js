let books = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert Martin",
        price: 25.5
    },
    {
        id: 2,
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        price: 30.0
    },
    {
        id: 3,
        title: "Node.js Design Patterns",
        author: "Mario Casciaro",
        price: 35.99
    },
    {
        id: 4,
        title: "Express.js Guide",
        author: "Azat Mardan",
        price: 22.5
    },
    {
        id: 5,
        title: "MongoDB: The Definitive Guide",
        author: "Kristina Chodorow",
        price: 40.0
    },
    {
        id: 6,
        title: "React Patterns",
        author: "Michael Chan",
        price: 28.75
    },
    {
        id: 7,
        title: "Node.js in Action",
        author: "Mike Cantelon",
        price: 32.0
    },
    {
        id: 8,
        title: "JavaScript Patterns",
        author: "Stoyan Stefanov",
        price: 26.5
    },
    {
        id: 9,
        title: "Express.js in Practice",
        author: "Hage Yaapa",
        price: 24.99
    },
    {
        id: 10,
        title: "Node.js Best Practices",
        author: "Yoni Goldberg",
        price: 29.0
    }
];

let nextId = 11;

const getBooks = () => books;

const getBookById = (id) => books.find(book => book.id === parseInt(id));

const addBook = (bookData) => {
    const newBook = {
        id: nextId++,
        ...bookData
    };
    books.push(newBook);
    return newBook;
};

const updateBook = (id, updateData) => {
    const bookIndex = books.findIndex(book => book.id === parseInt(id));
    if (bookIndex === -1) return null;
    
    books[bookIndex] = { ...books[bookIndex], ...updateData };
    return books[bookIndex];
};

const deleteBook = (id) => {
    const bookIndex = books.findIndex(book => book.id === parseInt(id));
    if (bookIndex === -1) return null;
    
    return books.splice(bookIndex, 1)[0];
};

const searchBooks = (query) => {
    if (!query) return books;
    return books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase())
    );
};

const getBooksPaginated = (books, page = 1, limit = 5) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = books.slice(startIndex, endIndex);
    
    return {
        data: paginatedBooks,
        page: parseInt(page),
        limit: parseInt(limit),
        total: books.length
    };
};

module.exports = {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBooksPaginated
};
