const express = require('express');
const router = express.Router();

let tasks = [];
let nextId = 1;

router.post('/', (req, res) => {
    const { title } = req.body;
    
    if (!title) {
        return res.status(400).json({
            error: 'ValidationError',
            message: 'Title is required'
        });
    }
    
    const newTask = {
        id: nextId++,
        title: title,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

router.get('/', (req, res) => {
    res.json({
        total: tasks.length,
        tasks: tasks
    });
});

router.get('/search', (req, res) => {
    const { title } = req.query;
    
    if (!title) {
        return res.status(400).json({
            error: 'ValidationError',
            message: 'Search query "title" is required'
        });
    }
    
    const foundTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(title.toLowerCase())
    );
    
    res.json({
        query: title,
        found: foundTasks.length,
        tasks: foundTasks
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        return res.status(404).json({
            error: 'Not Found',
            message: 'Task not found'
        });
    }
    
    res.json(task);
});

module.exports = router;
